<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email']);
$password = password_hash($data['password'], PASSWORD_BCRYPT);

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
} else {
    $stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    if ($stmt->execute([$email, $password])) {
        echo json_encode(['status' => 'success', 'message' => 'User registered']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
    }
}
?>
