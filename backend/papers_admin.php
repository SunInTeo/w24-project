<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM Essays");
        $essays = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $essays]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        http_response_code(500);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $resources = trim($_POST['resources'] ?? '');
    $own_resources = trim($_POST['own_resources'] ?? '');
    $content_of_presentation = trim($_POST['content_of_presentation'] ?? '');
    $content_of_examples = trim($_POST['content_of_examples'] ?? '');
    $resume_of_presentation = trim($_POST['resume_of_presentation'] ?? '');
    $keywords = $_POST['keywords'] ?? '[]';
    $user_id = intval($_POST['user_id'] ?? 0);

    if (empty($title) || empty($resources) || empty($user_id)) {
        echo json_encode(['status' => 'error', 'message' => 'Title, resources, and user ID are required.']);
        http_response_code(400);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO Essays (title, resources, own_resources, content_of_presentation, content_of_examples, resume_of_presentation, keywords, user_id)
            VALUES (:title, :resources, :own_resources, :content_of_presentation, :content_of_examples, :resume_of_presentation, :keywords, :user_id)
        ");
        $stmt->execute([
            'title' => $title,
            'resources' => $resources,
            'own_resources' => $own_resources,
            'content_of_presentation' => $content_of_presentation,
            'content_of_examples' => $content_of_examples,
            'resume_of_presentation' => $resume_of_presentation,
            'keywords' => $keywords,
            'user_id' => $user_id,
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Topic added successfully.']);
        http_response_code(200);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        http_response_code(500);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>