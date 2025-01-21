<?php
require_once __DIR__ . '/classes/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userType = $_POST['userType'] ?? null;
    $facultyNumber = ($userType === 'student') ? ($_POST['facultyNumber'] ?? null) : null;
    $name = trim($_POST['name'] ?? '');
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($name) || empty($username) || empty($email) || empty($password) || ($userType === 'student' && empty($facultyNumber))) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        http_response_code(400);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("SELECT * FROM Users WHERE username = :username OR email = :email");
        $stmt->execute(['username' => $username, 'email' => $email]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Username or Email already exists.']);
            http_response_code(409);
            exit;
        }

        $stmt = $pdo->prepare("
            INSERT INTO Users (user_type, faculty_number, name, username, email, password)
            VALUES (:userType, :facultyNumber, :name, :username, :email, :password)
        ");
        $stmt->execute([
            'userType' => $userType,
            'facultyNumber' => $facultyNumber,
            'name' => $name,
            'username' => $username,
            'email' => $email,
            'password' => $hashedPassword,
        ]);

        $userId = $pdo->lastInsertId();

        echo json_encode([
            'status' => 'success',
            'message' => 'Registration successful.',
            'user' => [
                'user_id' => $userId,
                'username' => $username,
                'user_type' => $userType,
                'email' => $email,
                'faculty_number' => $facultyNumber,
                'name' => $name,
            ]
        ]);
        http_response_code(200);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        http_response_code(500);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    http_response_code(405);
}
?>