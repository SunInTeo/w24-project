<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);

        $user_id = intval($input['user_id'] ?? 0);
        $presentation_type = $input['presentation_type'] ?? '';
        $presentation_datetime = $input['presentation_datetime'] ?? '';

        if (empty($user_id) || empty($presentation_type) || empty($presentation_datetime)) {
            echo json_encode(['status' => 'error', 'message' => 'User ID, presentation type, and presentation datetime are required.']);
            http_response_code(400);
            exit;
        }

        $pdo->beginTransaction();

        if ($presentation_type === 'Essay') {
            $stmt = $pdo->prepare("
                UPDATE Users 
                SET essay_presentation_datetime = :presentation_datetime 
                WHERE user_id = :user_id
            ");
            $stmt->execute([
                'presentation_datetime' => $presentation_datetime,
                'user_id' => $user_id,
            ]);

        } elseif ($presentation_type === 'Project') {
            $stmt = $pdo->prepare("
                SELECT t.team_id 
                FROM TeamMembers tm
                JOIN Teams t ON tm.team_id = t.team_id
                WHERE tm.user_id = :user_id
            ");
            $stmt->execute(['user_id' => $user_id]);
            $team_id = $stmt->fetchColumn();

            if (!$team_id) {
                echo json_encode(['status' => 'error', 'message' => 'User is not associated with any team.']);
                http_response_code(400);
                exit;
            }

            $stmt = $pdo->prepare("
                SELECT u.user_id 
                FROM TeamMembers tm
                JOIN Users u ON tm.user_id = u.user_id
                WHERE tm.team_id = :team_id
            ");
            $stmt->execute(['team_id' => $team_id]);
            $team_members = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (!$team_members) {
                echo json_encode(['status' => 'error', 'message' => 'No team members found for this project.']);
                http_response_code(404);
                exit;
            }

            $stmt = $pdo->prepare("
                UPDATE Users 
                SET project_presentation_datetime = :presentation_datetime 
                WHERE user_id = :user_id
            ");

            foreach ($team_members as $member_id) {
                $stmt->execute([
                    'presentation_datetime' => $presentation_datetime,
                    'user_id' => $member_id,
                ]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid presentation type.']);
            http_response_code(400);
            exit;
        }

        $pdo->commit();

        echo json_encode(['status' => 'success', 'message' => 'Presentation time assigned successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        http_response_code(405);
    }

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    http_response_code(500);
}
?>