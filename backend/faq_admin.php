<?php

require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json'); 

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->prepare("SELECT question, answer FROM FAQ");
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($questions) {
            echo json_encode(['status' => 'success', 'data' => $questions]);
        } else {
            echo json_encode(['status' => 'success', 'data' => []]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (isset($inputData['question']) && !empty($inputData['question']) && isset($inputData['answer']) && !empty($inputData['answer'])) {
            $question = htmlspecialchars($inputData['question']);
            $answer = htmlspecialchars($inputData['answer']);
            
            $stmt = $pdo->prepare("INSERT INTO FAQ (question, answer) VALUES (:question, :answer)");
            $stmt->execute(['question' => $question, 'answer' => $answer]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'success', 'message' => 'New question added successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to add new question']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid data provided']);
            http_response_code(400); 
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (isset($inputData['question']) && !empty($inputData['question'])) {
            $question = htmlspecialchars($inputData['question']);

            $stmt = $pdo->prepare("DELETE FROM FAQ WHERE question = :question");
            $stmt->execute(['question' => $question]);

            if ($stmt->rowCount() > 0) {
                echo json_encode(['status' => 'success', 'message' => 'Question deleted successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Question not found or already deleted']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Question is required to delete']);
            http_response_code(400);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        http_response_code(405);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    http_response_code(500);
}
?>
