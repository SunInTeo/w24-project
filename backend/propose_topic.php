<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $proposalType = trim($input['proposal_type'] ?? '');
    $topicLabel = trim($input['topic_label'] ?? '');
    $topicInfo = trim($input['topic_info'] ?? '');
    $proposedByUserId = trim($input['proposed_by_user_id'] ?? '');
    $proposedByUserName = trim($input['proposed_by_user_name'] ?? '');

    if (empty($proposalType) || empty($topicLabel) || empty($topicInfo) || empty($proposedByUserId) || empty($proposedByUserName)) {
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit;
    }

    try {
        $userCheckStmt = $pdo->prepare("SELECT COUNT(*) FROM Users WHERE faculty_number = :faculty_number");
        $userCheckStmt->bindParam(':faculty_number', $proposedByUserId, PDO::PARAM_STR);
        $userCheckStmt->execute();
        $userExists = $userCheckStmt->fetchColumn();

        if (!$userExists) {
            echo json_encode(["success" => false, "message" => "Invalid user ID."]);
            exit;
        }

        $stmt = $pdo->prepare(
            "INSERT INTO ProposedTopics (proposal_type, topic_label, topic_info, proposed_by_user_id, proposed_by_user_name)
             VALUES (:proposal_type, :topic_label, :topic_info, :proposed_by_user_id, :proposed_by_user_name)"
        );
        $stmt->bindParam(':proposal_type', $proposalType, PDO::PARAM_STR);
        $stmt->bindParam(':topic_label', $topicLabel, PDO::PARAM_STR);
        $stmt->bindParam(':topic_info', $topicInfo, PDO::PARAM_STR);
        $stmt->bindParam(':proposed_by_user_id', $proposedByUserId, PDO::PARAM_STR);
        $stmt->bindParam(':proposed_by_user_name', $proposedByUserName, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Topic proposed successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to propose topic."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
}
?>