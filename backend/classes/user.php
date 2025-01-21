<?php

class User
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function register($username, $email, $password)
    {
        if (empty($username) || empty($email) || empty($password)) {
            return 'All fields are required.';
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'Invalid email format.';
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        try {
            $stmt = $this->pdo->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
            $stmt->execute([
                ':username' => $username,
                ':email' => $email,
                ':password' => $hashedPassword
            ]);
            return true;
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                return 'Email or username already exists.';
            } else {
                return 'Registration failed: ' . $e->getMessage();
            }
        }
    }

    public function login($username, $password)
    {
        if (empty($username) || empty($password)) {
            return 'Username and password are required.';
        }

        try {
            $stmt = $this->pdo->prepare('SELECT * FROM users WHERE username = :username');
            $stmt->execute([':username' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                session_start();
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['user_type'] = $user['user_type'];
                return true;
            } else {
                return false;
            }
        } catch (PDOException $e) {
            return 'Login failed: ' . $e->getMessage();
        }
    }

    public function logout()
    {
        session_start();
        session_unset();
        session_destroy();
        return true;
    }

    public function isUsernameAvailable($username)
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
        $stmt->execute([':username' => $username]);
        return $stmt->fetchColumn() == 0;
    }

    public function isEmailAvailable($email)
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        return $stmt->fetchColumn() == 0;
    }
}
?>