<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Check if project_id is provided
        $project_id = intval($_GET['project_id'] ?? 0);
        if ($project_id > 0) {
            // Fetch all teams for the given project ID
            $stmt = $pdo->prepare("
                SELECT 
                    t.team_id,
                    t.team_comments,
                    t.sample_distribution_1,
                    t.sample_distribution_2,
                    t.sample_distribution_3,
                    GROUP_CONCAT(u.faculty_number) AS team_members
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
            // Check if user_id is provided
            $user_id = intval($_GET['user_id'] ?? 0);
            if ($user_id === 0) {
                echo json_encode(['status' => 'error', 'message' => 'Either project ID or user ID is required.']);
                http_response_code(400);
                exit;
            }

            // Fetch the user's team
            $stmt = $pdo->prepare("
                SELECT 
                    t.team_id,
                    t.team_comments,
                    t.sample_distribution_1,
                    t.sample_distribution_2,
                    t.sample_distribution_3,
                    p.project_id,
                    p.title AS project_title,
                    p.description AS project_description,
                    GROUP_CONCAT(u.faculty_number) AS team_members
                FROM 
                    TeamMembers tm
                JOIN 
                    Teams t ON tm.team_id = t.team_id
                JOIN 
                    Projects p ON t.project_id = p.project_id
                LEFT JOIN 
                    TeamMembers tm2 ON t.team_id = tm2.team_id
                LEFT JOIN 
                    Users u ON tm2.user_id = u.user_id
                WHERE 
                    tm.user_id = :user_id
                GROUP BY 
                    t.team_id
            ");
            $stmt->execute(['user_id' => $user_id]);
            $team = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$team) {
                echo json_encode(['status' => 'success', 'data' => null, 'message' => 'The user is not part of any team.']);
            } else {
                echo json_encode(['status' => 'success', 'data' => $team]);
            }
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
