<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");
require 'db.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['form_id']) || !isset($data['answers'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
    exit;
}

$formId = $data['form_id'];
$answers = $data['answers'];
$respondentName = '';
$respondentEmail = '';

try {
    $pdo->beginTransaction();

    // 1. Get all question texts for this form to identify name/email questions
    $stmt_q = $pdo->prepare("SELECT id, question_text FROM form_questions WHERE form_id = ?");
    $stmt_q->execute([$formId]);
    $questions = $stmt_q->fetchAll(PDO::FETCH_KEY_PAIR); // Creates an array like [question_id => question_text]

    // 2. Insert a placeholder respondent record first
    $stmtRespondent = $pdo->prepare("INSERT INTO form_respondents (form_id, name, email, submission_date) VALUES (?, '', '', NOW())");
    $stmtRespondent->execute([$formId]);
    $respondentId = $pdo->lastInsertId();

    // 3. Loop through answers to save them AND find the name/email
    $stmtResponse = $pdo->prepare("INSERT INTO form_responses (respondent_id, question_id, answer) VALUES (?, ?, ?)");
    foreach ($answers as $questionId => $answer) {
        $answerValue = is_array($answer) ? json_encode($answer) : $answer;
        if (isset($questions[$questionId])) {
            $stmtResponse->execute([$respondentId, $questionId, $answerValue]);
            
            // Check if this question is for the name or email
            $questionTextLower = strtolower($questions[$questionId]);
            if (strpos($questionTextLower, 'name') !== false) {
                $respondentName = $answerValue;
            }
            if (strpos($questionTextLower, 'email') !== false) {
                $respondentEmail = $answerValue;
            }
        }
    }

    // 4. Update the respondent record with the found name/email
    if (!empty($respondentName) || !empty($respondentEmail)) {
        $stmtUpdateRespondent = $pdo->prepare("UPDATE form_respondents SET name = ?, email = ? WHERE id = ?");
        $stmtUpdateRespondent->execute([$respondentName, $respondentEmail, $respondentId]);
    }

    $pdo->commit();

    echo json_encode(["status" => "success", "message" => "Response submitted successfully.", "respondent_id" => $respondentId]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>