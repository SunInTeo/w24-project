<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $project_id = isset($_GET['project_id']) ? intval($_GET['project_id']) : 0;

        if ($project_id > 0) {
            $stmt = $pdo->prepare("
                SELECT 
                    t.team_id,
                    t.team_comments,
                    t.sample_distribution_1,
                    t.sample_distribution_2,
                    t.sample_distribution_3,
                    GROUP_CONCAT(u.faculty_number) AS users_on_team
                FROM 
                    Teams t
                LEFT JOIN 
                    TeamMembers tm ON t.team_id = tm.team_id
                LEFT JOIN 
                    Users u ON tm.user_id = u.user_id
                WHERE 
                    t.project_id = :project_id
                GROUP BY 
                    t.team_id
            ");
            $stmt->execute(['project_id' => $project_id]);
            $teams = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['status' => 'success', 'data' => $teams]);
        } else {
            $stmt = $pdo->query("
                SELECT 
                    project_id,
                    title,
                    description,
                    example_distribution_1,
                    example_distribution_2,
                    example_distribution_3,
                    integration,
                    requirements,
                    comments
                FROM 
                    Projects
            ");
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['status' => 'success', 'data' => $projects]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true);
        $project_id = intval($input['project_id'] ?? 0);
        $title = trim($input['title'] ?? '');
        $description = trim($input['description'] ?? '');
        $example_distribution_1 = trim($input['example_distribution_1'] ?? '');
        $example_distribution_2 = trim($input['example_distribution_2'] ?? '');
        $example_distribution_3 = trim($input['example_distribution_3'] ?? '');
        $integration = trim($input['integration'] ?? '');
        $requirements = trim($input['requirements'] ?? '');
        $comments = trim($input['comments'] ?? '');
        $teams = $input['teams'] ?? [];

        if (empty($project_id) || empty($title) || empty($description)) {
            echo json_encode(['status' => 'error', 'message' => 'Project ID, title, and description are required.']);
            http_response_code(400);
            exit;
        }

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            UPDATE Projects
            SET title = :title,
                description = :description,
                example_distribution_1 = :example_distribution_1,
                example_distribution_2 = :example_distribution_2,
                example_distribution_3 = :example_distribution_3,
                integration = :integration,
                requirements = :requirements,
                comments = :comments
            WHERE project_id = :project_id
        ");
        $stmt->execute([
            'project_id' => $project_id,
            'title' => $title,
            'description' => $description,
            'example_distribution_1' => $example_distribution_1,
            'example_distribution_2' => $example_distribution_2,
            'example_distribution_3' => $example_distribution_3,
            'integration' => $integration,
            'requirements' => $requirements,
            'comments' => $comments,
        ]);

        foreach ($teams as $team) {
            $team_id = intval($team['team_id'] ?? 0);
            $team_comments = trim($team['team_comments'] ?? '');
            $sample_distribution_1 = trim($team['sample_distribution_1'] ?? '');
            $sample_distribution_2 = trim($team['sample_distribution_2'] ?? '');
            $sample_distribution_3 = trim($team['sample_distribution_3'] ?? '');
            $users_on_team = $team['users_on_team'] ?? [];

            if ($team_id > 0) {
                $stmt = $pdo->prepare("
                    UPDATE Teams
                    SET team_comments = :team_comments,
                        sample_distribution_1 = :sample_distribution_1,
                        sample_distribution_2 = :sample_distribution_2,
                        sample_distribution_3 = :sample_distribution_3
                    WHERE team_id = :team_id
                ");
                $stmt->execute([
                    'team_comments' => $team_comments,
                    'sample_distribution_1' => $sample_distribution_1,
                    'sample_distribution_2' => $sample_distribution_2,
                    'sample_distribution_3' => $sample_distribution_3,
                    'team_id' => $team_id,
                ]);

                $stmt = $pdo->prepare("DELETE FROM TeamMembers WHERE team_id = :team_id");
                $stmt->execute(['team_id' => $team_id]);

                foreach ($users_on_team as $user_id) {
                    $stmt = $pdo->prepare("
                        INSERT INTO TeamMembers (team_id, user_id)
                        VALUES (:team_id, :user_id)
                    ");
                    $stmt->execute(['team_id' => $team_id, 'user_id' => $user_id]);
                }
            }
        }

        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Project and teams updated successfully.']);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents("php://input"), true);
        $projectIds = $input['project_ids'] ?? [];

        if (empty($projectIds) || !is_array($projectIds)) {
            echo json_encode(['status' => 'error', 'message' => 'No valid project IDs provided for deletion.']);
            http_response_code(400);
            exit;
        }

        $placeholders = implode(',', array_fill(0, count($projectIds), '?'));
        $stmt = $pdo->prepare("DELETE FROM Projects WHERE project_id IN ($placeholders)");
        $stmt->execute($projectIds);

        echo json_encode(['status' => 'success', 'message' => 'Projects deleted successfully.']);
        http_response_code(200);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        $title = trim($input['title'] ?? '');
        $description = trim($input['description'] ?? '');
        $example_distribution_1 = trim($input['example_distribution_1'] ?? '');
        $example_distribution_2 = trim($input['example_distribution_2'] ?? '');
        $example_distribution_3 = trim($input['example_distribution_3'] ?? '');
        $integration = trim($input['integration'] ?? '');
        $requirements = trim($input['requirements'] ?? '');
        $comments = trim($input['comments'] ?? '');
        $teams = $input['teams'] ?? [];

        if (empty($title) || empty($description)) {
            echo json_encode(['status' => 'error', 'message' => 'Title and description are required.']);
            http_response_code(400);
            exit;
        }

        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO Projects (title, description, example_distribution_1, example_distribution_2, example_distribution_3, integration, requirements, comments)
            VALUES (:title, :description, :example_distribution_1, :example_distribution_2, :example_distribution_3, :integration, :requirements, :comments)
        ");
        $stmt->execute([
            'title' => $title,
            'description' => $description,
            'example_distribution_1' => $example_distribution_1,
            'example_distribution_2' => $example_distribution_2,
            'example_distribution_3' => $example_distribution_3,
            'integration' => $integration,
            'requirements' => $requirements,
            'comments' => $comments,
        ]);
        $project_id = $pdo->lastInsertId();

        foreach ($teams as $team) {
            $team_comments = trim($team['team_comments'] ?? '');
            $sample_distribution_1 = trim($team['sample_distribution_1'] ?? '');
            $sample_distribution_2 = trim($team['sample_distribution_2'] ?? '');
            $sample_distribution_3 = trim($team['sample_distribution_3'] ?? '');
            $users_on_team = $team['users_on_team'] ?? [];

            $stmt = $pdo->prepare("
                INSERT INTO Teams (project_id, team_comments, sample_distribution_1, sample_distribution_2, sample_distribution_3)
                VALUES (:project_id, :team_comments, :sample_distribution_1, :sample_distribution_2, :sample_distribution_3)
            ");
            $stmt->execute([
                'project_id' => $project_id,
                'team_comments' => $team_comments,
                'sample_distribution_1' => $sample_distribution_1,
                'sample_distribution_2' => $sample_distribution_2,
                'sample_distribution_3' => $sample_distribution_3,
            ]);
            $team_id = $pdo->lastInsertId();

            foreach ($users_on_team as $user_id) {
                $stmt = $pdo->prepare("
                    INSERT INTO TeamMembers (team_id, user_id)
                    VALUES (:team_id, :user_id)
                ");
                $stmt->execute(['team_id' => $team_id, 'user_id' => $user_id]);
            }
        }

        $pdo->commit();
        echo json_encode(['status' => 'success', 'message' => 'Project created successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
        http_response_code(405);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    http_response_code(500);
}
?>