<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userType = $_POST['userType'];
    $facultyNumber = $userType === 'student' ? $_POST['facultyNumber'] : null;
    $name = trim($_POST['name']);
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Check if username or email already exists
    $stmt = $pdo->prepare("SELECT * FROM Users WHERE username = :username OR email = :email");
    $stmt->execute(['username' => $username, 'email' => $email]);

    if ($stmt->rowCount() > 0) {
        die("Error: Username or Email already exists.");
    }

    // Insert user into the database
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
        'password' => $password,
    ]);

    echo "Registration successful.";
}
?>