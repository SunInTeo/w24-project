<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        try {
            $stmt = $pdo->query("SELECT * FROM Essays");
            $essays = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['status' => 'success', 'data' => $essays]);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            http_response_code(500);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        try {
            $input = json_decode(file_get_contents("php://input"), true);
            $essay_id = intval($input['essay_id'] ?? 0);
            $user_id = intval($input['user_id'] ?? 0);
            $title = trim($input['title'] ?? '');
            $resources = trim($input['resources'] ?? '');
            $own_resources = trim($input['own_resources'] ?? '');
            $content_of_presentation = trim($input['content_of_presentation'] ?? '');
            $content_of_examples = trim($input['content_of_examples'] ?? '');
            $resume_of_presentation = trim($input['resume_of_presentation'] ?? '');
            $keywords = trim($input['keywords'] ?? '');
            $comments = trim($input['comments'] ?? '');

            if (empty($essay_id) || empty($title)) {
                echo json_encode(['status' => 'error', 'message' => 'Essay ID and title are required.']);
                http_response_code(400);
                exit;
            }

            // Start transaction
            $pdo->beginTransaction();

            // Update essay details
            $stmt = $pdo->prepare("
                UPDATE Essays
                SET title = :title,
                    resources = :resources,
                    own_resources = :own_resources,
                    content_of_presentation = :content_of_presentation,
                    content_of_examples = :content_of_examples,
                    resume_of_presentation = :resume_of_presentation,
                    keywords = :keywords,
                    comments = :comments,
                    user_id = :user_id
                WHERE essay_id = :essay_id
            ");
            $stmt->execute([
                'title' => $title,
                'resources' => $resources,
                'own_resources' => $own_resources,
                'content_of_presentation' => $content_of_presentation,
                'content_of_examples' => $content_of_examples,
                'resume_of_presentation' => $resume_of_presentation,
                'keywords' => $keywords,
                'comments' => $comments,
                'user_id' => $user_id,
                'essay_id' => $essay_id,
            ]);

            // Update user's essay_id in Users table
            $stmt = $pdo->prepare("
                UPDATE Users
                SET essay_id = :essay_id
                WHERE user_id = :user_id
            ");
            $stmt->execute([
                'essay_id' => $essay_id,
                'user_id' => $user_id,
            ]);

            // Commit transaction
            $pdo->commit();

            echo json_encode(['status' => 'success', 'message' => 'Essay and user association updated successfully.']);

        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            echo json_encode([
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage(),
            ]);
            http_response_code(500);
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