<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    $topic = trim($input['topic'] ?? '');
    $description = trim($input['description'] ?? '');
    $recipient = 'example@example.com'; // Replace with the recipient email address
    $subject = "New Topic Proposal: $topic";

    if (empty($topic) || empty($description)) {
        echo json_encode(['status' => 'error', 'message' => 'Both topic and description are required.']);
        http_response_code(400);
        exit;
    }

    $message = "You have received a new topic proposal:\n\n";
    $message .= "Topic: $topic\n\n";
    $message .= "Description:\n$description";

    $headers = [
        'From' => 'no-reply@yourdomain.com', // Replace with your domain email
        'Reply-To' => 'no-reply@yourdomain.com',
        'X-Mailer' => 'PHP/' . phpversion(),
    ];

    $headersString = '';
    foreach ($headers as $key => $value) {
        $headersString .= "$key: $value\r\n";
    }

    if (mail($recipient, $subject, $message, $headersString)) {
        echo json_encode(['status' => 'success', 'message' => 'Email sent successfully.']);
        http_response_code(200);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send email.']);
        http_response_code(500);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>