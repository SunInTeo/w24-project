<?php
$host = 'localhost';
$username = 'root'; #default
$password = ''; #default
$dbname = 'database_structure.sql';

try {
    // Establish database connection using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
