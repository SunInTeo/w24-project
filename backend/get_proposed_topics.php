<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    try {
        $stmt = $pdo->query(
            "SELECT proposal_type, topic_label, topic_info, proposed_by_user_name, created_at
             FROM ProposedTopics
             ORDER BY created_at DESC"
        );
        $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "topics" => $topics]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
}