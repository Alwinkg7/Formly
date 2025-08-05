<?php
session_start();

error_log("Session ID: " . session_id());
error_log("Session user_id: " . ($_SESSION['user_id'] ?? 'not set'));

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Log raw payload
$input = file_get_contents("php://input");
file_put_contents("debug_payload.json", $input); // 🪵 Log payload
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["error" => "Invalid JSON", "raw" => $input]);
    exit;
}

function map_type_to_enum($type) {
    switch ($type) {
        case 'text_input':
        case 'text_area': return 'text';
        case 'radio_buttons': return 'multiple_choice';
        case 'checkboxes': return 'boolean';
        case 'scale_question': return 'rating';
        default: return 'text';
    }
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO forms (user_id, title, description, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$user_id, $data['title'], $data['description']]);
    $form_id = $pdo->lastInsertId();

    $stmt_questions = $pdo->prepare("INSERT INTO form_questions (form_id, question_text, question_type, options, min_value, max_value, is_required, question_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt_options = $pdo->prepare("INSERT INTO form_options (question_id, option_text) VALUES (?, ?)");

    foreach ($data['questions'] as $q) {
        $db_question_type = map_type_to_enum($q['type']);
        $options_json = !empty($q['options']) ? json_encode($q['options']) : null;
        $min_val = isset($q['min']) ? intval($q['min']) : 1;
        $max_val = isset($q['max']) ? intval($q['max']) : 5;
        $is_required = isset($q['is_required']) ? (int)$q['is_required'] : 0;
        $question_order = isset($q['order']) ? intval($q['order']) : null;

        $stmt_questions->execute([
            $form_id,
            $q['question_text'],
            $db_question_type,
            $options_json,
            $min_val,
            $max_val,
            $is_required,
            $question_order
        ]);

        $question_id = $pdo->lastInsertId();

        if ($db_question_type === 'multiple_choice' && !empty($q['options'])) {
            foreach($q['options'] as $option_text) {
                $stmt_options->execute([$question_id, $option_text]);
            }
        }
    }

    $pdo->commit();
    echo json_encode(["status" => "success", "form_id" => $form_id]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
