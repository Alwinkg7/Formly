<?php
$host = 'localhost';
$db   = 'feedback_db';
$user = 'root'; // Change this to an existing MySQL username
$pass = ''; // Change this to the password for that user (e.g., empty for default root in XAMPP)
$charset = 'utf8mb4';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
  exit;
}
?>
