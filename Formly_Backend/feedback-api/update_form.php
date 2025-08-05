<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

header("Content-Type: application/json");

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON or missing form ID"]);
    exit;
}

$form_id = intval($data['id']);

try {
    $pdo->beginTransaction();

    // 1. Update form details
    $stmt_form = $pdo->prepare("UPDATE forms SET title = ?, description = ? WHERE id = ?");
    $stmt_form->execute([$data['title'], $data['description'], $form_id]);

    // 2. Delete existing questions for this form (simpler for now, re-insert all)
    // In a real app, you'd compare and update/insert/delete individual questions
    $stmt_delete_questions = $pdo->prepare("DELETE FROM form_questions WHERE form_id = ?");
    $stmt_delete_questions->execute([$form_id]);

    // 3. Insert updated questions
    $stmt_insert_questions = $pdo->prepare("INSERT INTO form_questions (form_id, question_text, question_type, options, min_value, max_value, is_required, question_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($data['questions'] as $q) {
        $options_json = !empty($q['options']) ? json_encode($q['options']) : null;
        $min_val = isset($q['min']) ? intval($q['min']) : null;
        $max_val = isset($q['max']) ? intval($q['max']) : null;
        $is_required = isset($q['is_required']) ? (bool)$q['is_required'] : false;
        $question_order = isset($q['order']) ? intval($q['order']) : null;

        $stmt_insert_questions->execute([
            $form_id,
            $q['question_text'],
            $q['type'] ?? 'text',
            $options_json,
            $min_val,
            $max_val,
            $is_required,
            $question_order
        ]);
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Form updated successfully"]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>