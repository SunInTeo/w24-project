<?php
session_start();
require_once __DIR__ . '/classes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $oldPassword = $data['oldPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    if (empty($oldPassword) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(['message' => 'All fields are required.']);
        exit;
    }

    if (strlen($newPassword) < 8) {
        http_response_code(400);
        echo json_encode(['message' => 'Password must be at least 8 characters long.']);
        exit;
    }

    try {
        $stmt = $conn->prepare('SELECT password FROM Users WHERE user_id = ?');
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['message' => 'User not found.']);
            exit;
        }

        $user = $result->fetch_assoc();
        $hashedPassword = $user['password'];

        if (!password_verify($oldPassword, $hashedPassword)) {
            http_response_code(400);
            echo json_encode(['message' => 'Old password is incorrect.']);
            exit;
        }

        $newHashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

        $updateStmt = $conn->prepare('UPDATE Users SET password = ? WHERE user_id = ?');
        $updateStmt->bind_param('si', $newHashedPassword, $user_id);
        $updateStmt->execute();

        if ($updateStmt->affected_rows > 0) {
            echo json_encode(['message' => 'Password changed successfully.']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Failed to change password.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'An error occurred.', 'error' => $e->getMessage()]);
    }
}
?>