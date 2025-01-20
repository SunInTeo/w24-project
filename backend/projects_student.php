<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $pdo->query("
            SELECT project_id, title, description, example_distribution_1, example_distribution_2, example_distribution_3, integration, requirements, comments
            FROM Projects
        ");
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $projects]);

    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $project_id = intval($input['project_id'] ?? 0);
        $team = $input['team'] ?? [];

        if (empty($project_id) || empty($team['members'])) {
            echo json_encode(['status' => 'error', 'message' => 'Project ID and team members are required.']);
            http_response_code(400);
            exit;
        }

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO Teams (project_id, team_comments)
            VALUES (:project_id, :team_comments)
            ON DUPLICATE KEY UPDATE team_comments = :team_comments
        ");
        $stmt->execute([
            'project_id' => $project_id,
            'team_comments' => $team['comments'] ?? '',
        ]);

        $team_id = $pdo->lastInsertId();

        $stmt = $pdo->prepare("DELETE FROM TeamMembers WHERE team_id = :team_id");
        $stmt->execute(['team_id' => $team_id]);

        foreach ($team['members'] as $member) {
            $faculty_number = $member['faculty_number'] ?? '';
            if (empty($faculty_number)) {
                echo json_encode(['status' => 'error', 'message' => 'Faculty number is required for all members.']);
                http_response_code(400);
                exit;
            }

            $stmt = $pdo->prepare("SELECT user_id FROM Users WHERE faculty_number = :faculty_number");
            $stmt->execute(['faculty_number' => $faculty_number]);
            $user_id = $stmt->fetchColumn();

            if (!$user_id) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid faculty number: ' . $faculty_number]);
                http_response_code(400);
                exit;
            }

            $stmt = $pdo->prepare("
                INSERT INTO TeamMembers (team_id, user_id)
                VALUES (:team_id, :user_id)
            ");
            $stmt->execute([
                'team_id' => $team_id,
                'user_id' => $user_id,
            ]);


            $stmt = $pdo->prepare("
            UPDATE Users
            SET project_id = :project_id
            WHERE user_id = :user_id
        ");
            $stmt->execute([
                'project_id' => $project_id,
                'user_id' => $user_id,
            ]);
        }

        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Team assigned successfully.']);

    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true);
        $project_id = intval($input['project_id'] ?? 0);
        $updated_details = $input['updated_details'] ?? [];

        if (empty($project_id) || empty($updated_details['members'])) {
            echo json_encode(['status' => 'error', 'message' => 'Project ID and updated team members are required.']);
            http_response_code(400);
            exit;
        }

        $stmt = $pdo->prepare("SELECT team_id FROM TeamMembers WHERE user_id = (SELECT user_id FROM Users WHERE faculty_number = :faculty_number)");
        $stmt->execute(['faculty_number' => $updated_details['members'][0]['faculty_number']]);
        $team_id = $stmt->fetchColumn();

        if (!$team_id) {
            echo json_encode(['status' => 'error', 'message' => 'No team found for the provided faculty number.']);
            http_response_code(404);
            exit;
        }

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            UPDATE Teams
            SET 
                team_comments = :team_comments,
                sample_distribution_1 = :sample_distribution_1,
                sample_distribution_2 = :sample_distribution_2,
                sample_distribution_3 = :sample_distribution_3
            WHERE team_id = :team_id
        ");
        $stmt->execute([
            'team_id' => $team_id,
            'team_comments' => $updated_details['comments'] ?? '',
            'sample_distribution_1' => $updated_details['sample_distribution_1'] ?? null,
            'sample_distribution_2' => $updated_details['sample_distribution_2'] ?? null,
            'sample_distribution_3' => $updated_details['sample_distribution_3'] ?? null,
        ]);

        $stmt = $pdo->prepare("DELETE FROM TeamMembers WHERE team_id = :team_id");
        $stmt->execute(['team_id' => $team_id]);

        foreach ($updated_details['members'] as $member) {
            $faculty_number = $member['faculty_number'] ?? '';
            if (empty($faculty_number)) {
                echo json_encode(['status' => 'error', 'message' => 'Faculty number is required for all members.']);
                http_response_code(400);
                exit;
            }

            $stmt = $pdo->prepare("SELECT user_id FROM Users WHERE faculty_number = :faculty_number");
            $stmt->execute(['faculty_number' => $faculty_number]);
            $user_id = $stmt->fetchColumn();

            if (!$user_id) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid faculty number: ' . $faculty_number]);
                http_response_code(400);
                exit;
            }

            $stmt = $pdo->prepare("
                INSERT INTO TeamMembers (team_id, user_id)
                VALUES (:team_id, :user_id)
            ");
            $stmt->execute([
                'team_id' => $team_id,
                'user_id' => $user_id,
            ]);
            $stmt = $pdo->prepare("
            UPDATE Users
            SET project_id = :project_id
            WHERE user_id = :user_id
        ");
            $stmt->execute([
                'project_id' => $project_id,
                'user_id' => $user_id,
            ]);
        }

        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Team details updated successfully.']);

    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents("php://input"), true);
        $team_id = intval($input['team_id'] ?? 0);

        if (empty($team_id)) {
            echo json_encode(['status' => 'error', 'message' => 'Team ID is required.']);
            http_response_code(400);
            exit;
        }

        try {
            $pdo->beginTransaction();

            $stmt = $pdo->prepare("SELECT user_id FROM TeamMembers WHERE team_id = :team_id");
            $stmt->execute(['team_id' => $team_id]);
            $user_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (!empty($user_ids)) {
                $placeholders = implode(',', array_fill(0, count($user_ids), '?'));
                $stmt = $pdo->prepare("UPDATE Users SET project_id = NULL WHERE user_id IN ($placeholders)");
                $stmt->execute($user_ids);
            }

            $stmt = $pdo->prepare("DELETE FROM TeamMembers WHERE team_id = :team_id");
            $stmt->execute(['team_id' => $team_id]);

            $stmt = $pdo->prepare("DELETE FROM Teams WHERE team_id = :team_id");
            $stmt->execute(['team_id' => $team_id]);

            $pdo->commit();
            echo json_encode(['status' => 'success', 'message' => 'Team deleted successfully.']);
        } catch (PDOException $e) {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
            http_response_code(500);
        }
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