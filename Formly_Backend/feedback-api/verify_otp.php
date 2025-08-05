
<?php
header(header: "Access-Control-Allow-Origin: http://localhost:5173");
header(header: "Access-Control-Allow-Headers: Content-Type");
header(header: "Access-Control-Allow-Methods: POST");

require 'db.php';

$data = json_decode(json: file_get_contents(filename: 'php://input'), associative: true);


$contact = isset($data['contact']) ? trim(string: $data['contact']) : '';
$otp = isset($data['otp']) ? trim(string: $data['otp']) : '';

if (empty($contact) || empty($otp)) {
    echo json_encode(value: ['status' => 'error', 'message' => 'Missing contact or OTP']);
    exit;
}

// Look for matching OTP
$stmt = $pdo->prepare(query: "SELECT * FROM otp_resets WHERE contact = ? AND otp = ? LIMIT 1");
$stmt->execute(params: [$contact, $otp]);
$row = $stmt->fetch();

if ($row) {
    $expiresAt = strtotime(datetime: $row['expires_at']);
    $now = time();

    if ($now <= $expiresAt) {
        // Remove OTP after success
        $pdo->prepare(query: "DELETE FROM otp_resets WHERE contact = ?")->execute(params: [$contact]);

        echo json_encode(value: ['status' => 'success', 'message' => 'OTP verified']);
    } else {
        echo json_encode(value: ['status' => 'error', 'message' => 'OTP expired']);
    }
} else {
    echo json_encode(value: ['status' => 'error', 'message' => 'Invalid OTP']);
}
?>
