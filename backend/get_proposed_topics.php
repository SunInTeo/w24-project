<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $proposalType = isset($_GET["proposal_type"]) ? trim($_GET["proposal_type"]) : null;

        if ($proposalType) {
            if (!in_array($proposalType, ['Essay', 'Project'])) {
                echo json_encode(["success" => false, "message" => "Invalid proposal type."]);
                exit;
            }

            $stmt = $pdo->prepare(
                "SELECT topic_id, proposal_type, topic_label, topic_info, proposed_by_user_id, proposed_by_user_name
                 FROM ProposedTopics 
                 WHERE proposal_type = :proposal_type"
            );
            $stmt->bindParam(':proposal_type', $proposalType, PDO::PARAM_STR);
        } else {
            $stmt = $pdo->query(
                "SELECT topic_id, proposal_type, topic_label, topic_info, proposed_by_user_id, proposed_by_user_name
                 FROM ProposedTopics"
            );
        }

        $stmt->execute();
        $topics = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["success" => true, "topics" => $topics]);
    } elseif ($_SERVER["REQUEST_METHOD"] === "DELETE") {
        if (isset($_GET["topic_id"]) && is_numeric($_GET["topic_id"])) {
            $topicId = intval($_GET["topic_id"]);

            $stmt = $pdo->prepare("DELETE FROM ProposedTopics WHERE topic_id = :topic_id");
            $stmt->bindParam(":topic_id", $topicId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Topic deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to delete topic."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Missing or invalid topic ID."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid request method."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>