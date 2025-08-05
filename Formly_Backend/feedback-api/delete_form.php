<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$formId = $data['id'] ?? null;

if (!$formId) {
    echo json_encode(["status" => "error", "message" => "Missing form ID"]);
    exit;
}

try {
    // Begin transaction
    $pdo->beginTransaction();

    // Delete questions first (foreign key dependency)
   $stmt1 = $pdo->prepare("DELETE FROM form_questions WHERE form_id = ?");
    $stmt1->execute([$formId]);

    // Then delete the form
    $stmt2 = $pdo->prepare("DELETE FROM forms WHERE id = ?");
    $stmt2->execute([$formId]);

    // Commit transaction
    $pdo->commit();

    echo json_encode(["status" => "success", "message" => "Form deleted"]);
} catch (Exception $e) {
    $pdo->rollBack(); // Rollback if error
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
