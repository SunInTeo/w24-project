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
    public function login($email, $password)
    {
        try {
            // Retrieve the user from the database
            $stmt = $this->pdo->prepare('SELECT * FROM users WHERE email = :email');
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                return $user; // Return user data on successful login
            } else {
                return false; // Invalid credentials
            }
        } catch (PDOException $e) {
            return 'Login failed: ' . $e->getMessage();
        }
    }
}
?>
