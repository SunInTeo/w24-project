<?php
$users = [
    ['student', 'FN12345', 'Alice Johnson', 'alicej', 'alice.johnson@example.com', '1234'],
    ['student', 'FN12346', 'Bob Smith', 'bobsmith', 'bob.smith@example.com', '1234'],
    ['student', 'FN12347', 'Charlie Davis', 'charlied', 'charlie.davis@example.com', '1234'],
    ['student', 'FN12348', 'Diana Green', 'dianag', 'diana.green@example.com', '1234'],
    ['student', 'FN12349', 'Ethan White', 'ethanw', 'ethan.white@example.com', '1234'],
    ['student', 'FN12350', 'Fiona Black', 'fionab', 'fiona.black@example.com', '1234'],
    ['teacher', NULL, 'Gregory Brown', 'gregbrown', 'gregory.brown@example.com', '1234']
];

$sql = "INSERT INTO Users (user_type, faculty_number, name, username, email, password, essay_id, project_id, essay_presentation_datetime, project_presentation_datetime) VALUES";

$values = [];

foreach ($users as $user) {
    $hashed_password = password_hash($user[5], PASSWORD_DEFAULT);
    $faculty_number = $user[1] ? "'{$user[1]}'" : 'NULL';
    $values[] = "('{$user[0]}', {$faculty_number}, '{$user[2]}', '{$user[3]}', '{$user[4]}', '{$hashed_password}', NULL, NULL, NULL, NULL)";
}

$sql .= implode(", ", $values) . ";";

echo $sql;
?>