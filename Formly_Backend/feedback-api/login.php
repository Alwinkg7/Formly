<?php
session_start(); // ✅ Start the session

header("Access-Control-Allow-Origin: http://localhost:5173"); // ✅ Specific origin
header("Access-Control-Allow-Credentials: true");             // ✅ Required for cookies
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");        // ✅ Include OPTIONS for preflight

// ✅ Handle preflight request and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email']);
$password = $data['password'];

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'user_id' => $user['id'],
        'session_id' => session_id() // <- TEMPORARY
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
}
?>
