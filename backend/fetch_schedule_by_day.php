<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $selected_date = $_GET['day_date'] ?? '';
        $presentation_type = $_GET['presentation_type'] ?? '';

        if (empty($selected_date) || empty($presentation_type)) {
            echo json_encode(['status' => 'error', 'message' => 'Day date and presentation type are required.']);
            http_response_code(400);
            exit;
        }

        $valid_types = ['Essay', 'Project'];
        if (!in_array($presentation_type, $valid_types)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid presentation type.']);
            http_response_code(400);
            exit;
        }

        $column = $presentation_type === 'Essay' ? 'essay_presentation_datetime' : 'project_presentation_datetime';
        $idColumn = $presentation_type === 'Essay' ? 'u.essay_id' : 'u.project_id';
        $titleColumn = $presentation_type === 'Essay' ? 'e.title AS presentation_title' : 'p.title AS presentation_title';
        $joinTable = $presentation_type === 'Essay' ? 'Essays e ON u.essay_id = e.essay_id' : 'Projects p ON u.project_id = p.project_id';

        $stmt = $pdo->prepare("
            SELECT 
                u.user_id, 
                u.faculty_number, 
                u.name, 
                u.email, 
                u.user_type, 
                $idColumn AS presentation_id, 
                $titleColumn, 
                DATE_FORMAT($column, '%H:%i') AS presentation_time 
            FROM Users u
            LEFT JOIN $joinTable
            WHERE DATE($column) = :day_date
        ");

        $stmt->execute(['day_date' => $selected_date]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($users)) {
            echo json_encode([
                'status' => 'success',
                'users' => $users
            ]);
        } else {
            echo json_encode(['status' => 'success', 'message' => 'No users found for the selected day and type.', 'users' => []]);
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