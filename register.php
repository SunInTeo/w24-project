<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Include the database connection
    require './classes/db/db.php';

    // Retrieve and sanitize form inputs
    $username = htmlspecialchars(trim($_POST['username']));
    $email = htmlspecialchars(trim($_POST['email']));
    $password = htmlspecialchars(trim($_POST['password']));

    // Validate inputs
    if (empty($username) || empty($email) || empty($password)) {
        die('All fields are required.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die('Invalid email format.');
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Insert the user into the database
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':password' => $hashedPassword
        ]);

        echo 'Registration successful. You can now log in.';
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') { // Duplicate entry
            die('Email or username already exists.');
        } else {
            die('Registration failed: ' . $e->getMessage());
        }
    }
}

?>