<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require 'db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);
// check
$data = json_decode(file_get_contents("php://input"), true);
$contact = isset($data['contact']) ? trim($data['contact']) : '';

if (empty($contact)) {
    echo json_encode(["status" => "error", "message" => "Contact is required"]);
    exit();
}

// Logic to check if contact exists in `users` table
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR phone = ?");
$stmt->execute([$contact, $contact]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode([
        "status" => "error",
        "message" => "The entered email or phone is not registered."
    ]);
    exit();
}


$data = json_decode(file_get_contents('php://input'), true);
$contact = trim($data['contact']);
$otp = rand(100000, 999999);
$expires = date("Y-m-d H:i:s", strtotime("+10 minutes"));

// Store OTP
$pdo->prepare("INSERT INTO otp_resets (contact, otp, expires_at) VALUES (?, ?, ?)")
    ->execute([$contact, $otp, $expires]);

// Check if it's an email or phone
if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
    // Send via PHPMailer
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'formlycct@gmail.com'; // Use app password
        $mail->Password = 'kawe sbjx hbeg ygmd';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('formlycct@gmail.com', 'Formly');
        $mail->addAddress($contact);
        $mail->isHTML(true);
        $mail->Subject = "Your OTP Code";
        $mail->Body = "Your OTP for password reset is <b>$otp</b>. It is valid for 10 minutes.";

        $mail->send();
        echo json_encode(['status' => 'success', 'message' => 'OTP sent to email']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Mail error: ' . $mail->ErrorInfo]);
    }

} 

?>
