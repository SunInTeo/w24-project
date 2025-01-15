<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT 
                e.essay_id, 
                e.title, 
                e.resources, 
                e.own_resources, 
                e.content_of_presentation, 
                e.content_of_examples, 
                e.resume_of_presentation, 
                e.keywords, 
                e.comments, 
                u.faculty_number 
            FROM Essays e
            JOIN Users u ON e.user_id = u.user_id
        ");
        $essays = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($essays) {
            foreach ($essays as &$essay) {
                $essay['keywords'] = json_decode($essay['keywords'], true); 
            }
            echo json_encode(['status' => 'success', 'data' => $essays]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No essays available.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        http_response_code(500);
    }
}
 elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $resources = trim($_POST['resources'] ?? '');
    $own_resources = trim($_POST['own_resources'] ?? '');
    $content_of_presentation = trim($_POST['content_of_presentation'] ?? '');
    $content_of_examples = trim($_POST['content_of_examples'] ?? '');
    $resume_of_presentation = trim($_POST['resume_of_presentation'] ?? '');
    $keywords = $_POST['keywords'] ?? '';
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
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents("php://input"), true);
    $essayIds = $input['ids'] ?? [];

    if (empty($essayIds) || !is_array($essayIds)) {
        echo json_encode(['status' => 'error', 'message' => 'No valid IDs provided for deletion.']);
        http_response_code(400);
        exit;
    }

    try {
        $placeholders = implode(',', array_fill(0, count($essayIds), '?'));
        $stmt = $pdo->prepare("DELETE FROM Essays WHERE essay_id IN ($placeholders)");
        $stmt->execute($essayIds);

        echo json_encode(['status' => 'success', 'message' => 'Essays deleted successfully.']);
        http_response_code(200);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        http_response_code(500);
    }
}elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents("php://input"), true);
    $essay_id = intval($input['essay_id'] ?? 0);
    $title = trim($input['title'] ?? '');
    $resources = trim($input['resources'] ?? '');
    $own_resources = trim($input['own_resources'] ?? '');
    $content_of_presentation = trim($input['content_of_presentation'] ?? '');
    $content_of_examples = trim($input['content_of_examples'] ?? '');
    $resume_of_presentation = trim($input['resume_of_presentation'] ?? '');
    $keywords = $input['keywords'] ?? '';
    $comments = trim($input['comments'] ?? '');

    if (empty($essay_id) || empty($title)) {
        echo json_encode(['status' => 'error', 'message' => 'Essay ID and title are required.']);
        http_response_code(400);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            UPDATE Essays
            SET title = :title,
                resources = :resources,
                own_resources = :own_resources,
                content_of_presentation = :content_of_presentation,
                content_of_examples = :content_of_examples,
                resume_of_presentation = :resume_of_presentation,
                keywords = :keywords,
                comments = :comments
            WHERE essay_id = :essay_id
        ");
        $stmt->execute([
            'essay_id' => $essay_id,
            'title' => $title,
            'resources' => $resources,
            'own_resources' => $own_resources,
            'content_of_presentation' => $content_of_presentation,
            'content_of_examples' => $content_of_examples,
            'resume_of_presentation' => $resume_of_presentation,
            'keywords' => $keywords,
            'comments' => $comments,
        ]);

        echo json_encode(['status' => 'success', 'message' => 'Essay updated successfully.']);
        http_response_code(200);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        http_response_code(500);
    }
}else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>
