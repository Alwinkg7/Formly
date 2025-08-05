<?php
session_start(); // Start the session early

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    header("Content-Type: application/json");
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
    exit;
}

// Set headers BEFORE destroying the session
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Destroy session
session_unset();
session_destroy();

// Respond
echo json_encode([
    "status" => "success",
    "message" => "Logged out successfully"
]);
