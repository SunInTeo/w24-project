<?php
$host = 'localhost';
$username = 'root'; #default
$password = ''; #default
$dbname = '../db/database_structure.sql';

try {
    // Establish database connection using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
