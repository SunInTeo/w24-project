
<?php

require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json'); 

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare("SELECT * FROM FAQ");
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($questions) {
            echo json_encode(['status' => 'success', 'data' => $questions]);
        } else {
            echo json_encode(['status' => 'success', 'data' => []]);
        }
    }   else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
            http_response_code(405);
        }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    http_response_code(500);
}

?>