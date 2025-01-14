<?php
// user.php: User Class

class User
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    // Function to register a new user
    public function register($username, $email, $password)
    {
        // Validate inputs
        if (empty($username) || empty($email) || empty($password)) {
            return 'All fields are required.';
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'Invalid email format.';
        }

        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        try {
            // Insert the user into the database
            $stmt = $this->pdo->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
            $stmt->execute([
                ':username' => $username,
                ':email' => $email,
                ':password' => $hashedPassword
            ]);
            return true;
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') { // Duplicate entry
                return 'Email or username already exists.';
            } else {
                return 'Registration failed: ' . $e->getMessage();
            }
        }
    }

    // Function to authenticate a user
    public function login($username, $password)
    {
        if (empty($username) || empty($password)) {
            return 'Username and password are required.';
        }

        try {
            // Retrieve the user from the database
            $stmt = $this->pdo->prepare('SELECT * FROM users WHERE username = :username');
            $stmt->execute([':username' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                // Start session and set session variables
                session_start();
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['user_type'] = $user['user_type'];
                return true; // Successful login
            } else {
                return false; // Invalid credentials
            }
        } catch (PDOException $e) {
            return 'Login failed: ' . $e->getMessage();
        }
    }

    // Function to logout a user
    public function logout()
    {
        session_start();
        session_unset();
        session_destroy();
        return true;
    }

    // Function to check if username is available
    public function isUsernameAvailable($username)
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
        $stmt->execute([':username' => $username]);
        return $stmt->fetchColumn() == 0;
    }

    // Function to check if email is available
    public function isEmailAvailable($email)
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM users WHERE email = :email');
        $stmt->execute([':email' => $email]);
        return $stmt->fetchColumn() == 0;
    }
}
?>