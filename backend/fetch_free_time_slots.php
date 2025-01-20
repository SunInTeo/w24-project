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

        // Determine the column to query based on presentation type
        $column = ($presentation_type === 'Essay') ? 'essay_presentation_datetime' : 'project_presentation_datetime';

        // Fetch users presenting on the selected day
        $stmt = $pdo->prepare("
            SELECT 
                user_id, 
                faculty_number, 
                name, 
                email, 
                user_type, 
                $column AS presentation_datetime 
            FROM Users 
            WHERE DATE($column) = :day_date
        ");
        $stmt->execute(['day_date' => $selected_date]);
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch the presentation day details (start and end times)
        $stmt = $pdo->prepare("
            SELECT start_time, end_time, interval_count
            FROM PresentationDays 
            WHERE day_date = :day_date 
            AND presentation_type = :presentation_type
        ");
        $stmt->execute(['day_date' => $selected_date, 'presentation_type' => $presentation_type]);
        $dayDetails = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$dayDetails) {
            echo json_encode(['status' => 'error', 'message' => 'Presentation day not found.']);
            http_response_code(404);
            exit;
        }

        $startTime = new DateTime($dayDetails['start_time']);
        $endTime = new DateTime($dayDetails['end_time']);

        // Calculate slot duration for 20 equal slots
        $totalDuration = $endTime->getTimestamp() - $startTime->getTimestamp();
        $intervalSeconds = $totalDuration / 20; // 20 equal slots

        // Collect occupied slots
        $occupiedSlots = [];
        foreach ($users as $user) {
            $occupiedSlots[] = (new DateTime($user['presentation_datetime']))->format('H:i');
        }

        // Generate free slots
        $freeSlots = [];
        $currentSlot = clone $startTime;
        for ($i = 0; $i < 20; $i++) {
            $slotTime = $currentSlot->format('H:i');
            if (!in_array($slotTime, $occupiedSlots)) {
                $freeSlots[] = $slotTime;
            }
            $currentSlot->modify("+{$intervalSeconds} seconds");
        }

        echo json_encode([
            'status' => 'success',
            'users' => $users,
            'free_slots' => $freeSlots,
        ]);
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