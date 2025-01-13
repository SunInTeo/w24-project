<?php
$host = 'localhost';
$username = 'root'; #default
$password = ''; #default
$dbname = 'database_structure.sql';

// Create connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
