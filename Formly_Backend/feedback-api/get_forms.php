<?php
session_start(); // ✅ Start the session

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true"); // ✅ Allow session cookies
header("Content-Type: application/json; charset=UTF-8");

require 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized. Please log in first."
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $stmt = $pdo->prepare("SELECT id, title, description, created_at FROM forms WHERE user_id = ? ORDER BY id ASC");
    $stmt->execute([$user_id]);
    $forms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "forms" => $forms
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to fetch forms",
        "details" => $e->getMessage()
    ]);
}
?>
