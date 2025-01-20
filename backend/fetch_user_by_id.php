<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $user_id = intval($_GET['user_id'] ?? 0);

        if ($user_id <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'User ID is required and must be a positive integer.']);
            http_response_code(400);
            exit;
        }

        $stmt = $pdo->prepare("
            SELECT 
                user_id, 
                user_type, 
                faculty_number, 
                name, 
                username, 
                email, 
                essay_id, 
                project_id, 
                DATE_FORMAT(essay_presentation_datetime, '%Y-%m-%d %H:%i') AS essay_presentation_datetime, 
                DATE_FORMAT(project_presentation_datetime, '%Y-%m-%d %H:%i') AS project_presentation_datetime
            FROM Users 
            WHERE user_id = :user_id
        ");

        $stmt->execute(['user_id' => $user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(['status' => 'success', 'user' => $user]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User not found.']);
            http_response_code(404);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        http_response_code(405);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage(),
    ]);
    http_response_code(500);
}
?>