<?php
require_once __DIR__ . '/classes/db.php'; 

header('Content-Type: application/json'); 

$data = json_decode(file_get_contents('php://input'), true);
$topic = $data['topic'] ?? '';
$description = $data['description'] ?? '';

if (empty($topic) || empty($description)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO proposed_topics (topic, description, created_at) VALUES (:topic, :description, NOW())");
    $stmt->execute([':topic' => $topic, ':description' => $description]);

    echo json_encode(['status' => 'success', 'message' => 'Topic proposed successfully.']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to propose topic: ' . $e->getMessage()]);
}

exit;
?>