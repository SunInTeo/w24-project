<?php
require_once __DIR__ . '/session_start.php';

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'status' => 'success',
        'user' => [
            'user_id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'user_type' => $_SESSION['user_type'],
            'faculty_number' => $_SESSION['faculty_number'],
            'name' => $_SESSION['name']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
}
?>