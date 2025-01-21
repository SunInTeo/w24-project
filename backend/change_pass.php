<?php
session_start();
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'), true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid JSON input.']);
    exit;
}

$oldPassword = $data['oldPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';

if (empty($oldPassword) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode(['message' => 'All fields are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT password FROM Users WHERE user_id = ?');
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['message' => 'User not found.', 'success' => false]);
        exit;
    }

    if (!password_verify($oldPassword, $user['password'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Old password is incorrect.', 'success' => false]);
        exit;
    }

    $newHashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);

    $updateStmt = $pdo->prepare('UPDATE Users SET password = ? WHERE user_id = ?');
    if ($updateStmt->execute([$newHashedPassword, $user_id])) {
        echo json_encode(['message' => 'Password changed successfully.', "success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to change password.', "success" => false]);
    }
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['message' => 'Database error occurred.', 'success' => false]);
}
?>