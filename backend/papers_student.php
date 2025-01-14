<?php
require_once __DIR__ . '/classes/db.php'; 

header('Content-Type: application/json'); 

try {
    $query = "SELECT 
                essay_id, 
                title, 
                resources, 
                own_resources, 
                content_of_presentation, 
                content_of_examples, 
                resume_of_presentation, 
                keywords 
              FROM research_papers 
              WHERE status = 'approved'";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $papers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($papers) {
        foreach ($papers as &$paper) {
            $paper['keywords'] = json_encode(explode(',', $paper['keywords']));
        }

        echo json_encode([
            'status' => 'success',
            'data' => $papers
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'No research papers available.'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
