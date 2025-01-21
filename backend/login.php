<?php
require_once __DIR__ . '/classes/db.php';
require_once __DIR__ . '/session_start.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Username and password are required.']);
        http_response_code(400);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM Users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['faculty_number'] = $user['faculty_number'];
            $_SESSION['name'] = $user['name'];

            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful.',
                'user' => [
                    'user_id' => $user['user_id'],
                    'username' => $user['username'],
                    'name' => $user['name'],
                    'faculty_number' => $user['faculty_number'],
                    'user_type' => $user['user_type'],
                    'essay_id' => $user['essay_id'],
                    'project_id' => $user['project_id']
                ]
            ]);
            http_response_code(200);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
            http_response_code(401);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        http_response_code(500);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>