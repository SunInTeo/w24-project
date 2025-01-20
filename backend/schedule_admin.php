<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $day_id = intval($_GET['day_id'] ?? 0);

        if ($day_id > 0) {
            $stmt = $pdo->prepare("SELECT * FROM PresentationDays WHERE day_id = :day_id");
            $stmt->execute(['day_id' => $day_id]);
            $presentation_day = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($presentation_day) {
                echo json_encode(['status' => 'success', 'data' => $presentation_day]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Presentation day not found.']);
                http_response_code(404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM PresentationDays ORDER BY day_date, start_time");
            $presentation_days = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['status' => 'success', 'data' => $presentation_days]);
        }

    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $day_date = $input['day_date'] ?? '';
        $start_time = $input['start_time'] ?? '';
        $end_time = $input['end_time'] ?? '';
        $interval_count = intval($input['interval_count'] ?? 0);
        $presentation_type = $input['presentation_type'] ?? '';

        if (empty($day_date) || empty($start_time) || empty($end_time) || empty($presentation_type) || $interval_count <= 0) {
            echo json_encode(['status' => 'error', 'message' => 'All fields are required and must be valid.']);
            http_response_code(400);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO PresentationDays (day_date, start_time, end_time, interval_count, presentation_type)
            VALUES (:day_date, :start_time, :end_time, :interval_count, :presentation_type)
        ");

        $stmt->execute([
            'day_date' => $day_date,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'interval_count' => $interval_count,
            'presentation_type' => $presentation_type
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Presentation day added successfully.']);

    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents("php://input"), true);
        $day_id = intval($input['day_id'] ?? 0);

        if (empty($day_id)) {
            echo json_encode(['status' => 'error', 'message' => 'Day ID is required.']);
            http_response_code(400);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM PresentationDays WHERE day_id = :day_id");
        $stmt->execute(['day_id' => $day_id]);

        echo json_encode(['status' => 'success', 'message' => 'Presentation day deleted successfully.']);

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