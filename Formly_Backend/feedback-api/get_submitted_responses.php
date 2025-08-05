<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('db.php');
if (!$pdo) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
if (!isset($_GET['form_id'])) {
    echo json_encode(["error" => "form_id parameter is required"]);
    exit;
}

$form_id = intval($_GET['form_id']);

$stmt = $pdo->prepare("SELECT id, title, description FROM forms WHERE id = ?");
$stmt->execute([$form_id]);
$form = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$form) {
    echo json_encode(["error" => "Form not found"]);
    exit;
}

// --- START OF FIX ---
// Added "ORDER BY q.question_order ASC" to ensure consistent ordering
$stmt = $pdo->prepare(
    "SELECT id, question_text, question_type 
     FROM form_questions q
     WHERE form_id = ? 
     ORDER BY q.question_order ASC"
);
// --- END OF FIX ---
$stmt->execute([$form_id]);
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

$question_ids = array_column($questions, 'id');
$options = [];
if (!empty($question_ids)) {
    $in = str_repeat('?,', count($question_ids) - 1) . '?';
    $stmt = $pdo->prepare("SELECT question_id, option_text FROM form_options WHERE question_id IN ($in)");
    $stmt->execute($question_ids);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        $options[$row['question_id']][] = $row['option_text'];
    }
}

foreach ($questions as &$q) {
    $q['options'] = isset($options[$q['id']]) ? $options[$q['id']] : [];
}
unset($q);

$stmt = $pdo->prepare("SELECT id, name, email, submission_date FROM form_respondents WHERE form_id = ?");
$stmt->execute([$form_id]);
$respondents = $stmt->fetchAll(PDO::FETCH_ASSOC);

$respondent_ids = array_column($respondents, 'id');
$responses = [];
if (!empty($respondent_ids)) {
    $in = str_repeat('?,', count($respondent_ids) - 1) . '?';
    $stmt = $pdo->prepare("SELECT respondent_id, question_id, answer FROM form_responses WHERE respondent_id IN ($in)");
    $stmt->execute($respondent_ids);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        $responses[$row['respondent_id']][] = [
            "question_id" => intval($row['question_id']),
            "answer" => $row['answer']
        ];
    }
}

foreach ($respondents as &$resp) {
    $resp['answers'] = isset($responses[$resp['id']]) ? $responses[$resp['id']] : [];
}
unset($resp);

$output = [
    "form" => $form,
    "questions" => $questions,
    "respondents" => $respondents
];

echo json_encode($output, JSON_PRETTY_PRINT);
?>