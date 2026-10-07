<?php
declare(strict_types=1);

require '../bootstrap.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed.', 405);

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 50000) jsonError('Invalid request.');
try {
	$data = json_decode($rawBody, true, 32, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
	jsonError('Invalid request.');
}
if (!is_array($data)) jsonError('Invalid request.');

function consultationText(array $data, string $key, int $maxLength, bool $required = false): string {
	$value = trim((string) ($data[$key] ?? ''));
	if ($required && $value === '') jsonError('Please complete all required fields.');
	if (mb_strlen($value) > $maxLength) jsonError('One or more fields are too long.');
	return $value;
}
function safe(string $value): string {
	return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$typeLabels = [
	'formation' => 'Business Formation & Structuring Advice',
	'strategy' => 'Business & Strategy Consultation',
	'legal' => 'Legal Advice',
	'tax' => 'Tax Planning & Structuring Advisory',
	'marketing' => 'Marketing Consultation',
];
$type = consultationText($data, 'type', 30, true);
$name = consultationText($data, 'firstname', 150, true);
$company = consultationText($data, 'company', 150, true);
$email = consultationText($data, 'email', 254, true);
$phone = consultationText($data, 'phone', 50, true);
$contactMethod = consultationText($data, 'contactMethod', 30, true);
$contactTime = consultationText($data, 'contactTime', 150, true);
$otherTopic = consultationText($data, 'otherTopic', 1000);
$deadlineDetails = consultationText($data, 'deadlineDetails', 1000);
$additionalNotes = consultationText($data, 'additionalNotes', 3000);
$captchaToken = consultationText($data, 'captchaToken', 4096, true);

if (!isset($typeLabels[$type]) || !in_array($contactMethod, ['Phone call', 'WhatsApp', 'Email only'], true)) {
	jsonError('Please check your consultation selections.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonError('Please enter a valid email address.');

$topics = $data['topics'] ?? [];
if (!is_array($topics) || count($topics) < 1 || count($topics) > 20) jsonError('Please select at least one consultation topic.');
$topics = array_map(static fn($topic) => trim((string) $topic), $topics);
foreach ($topics as $topic) {
	if ($topic === '' || mb_strlen($topic) > 250) jsonError('Please check your consultation topics.');
}

$verifyContext = stream_context_create(['http' => [
	'method' => 'POST',
	'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
	'content' => http_build_query(['secret' => $secret_key, 'response' => $captchaToken]),
	'timeout' => 10,
]]);
$verifyResult = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $verifyContext);
$captchaResponse = $verifyResult === false ? null : json_decode($verifyResult, true);
if (!is_array($captchaResponse) || empty($captchaResponse['success'])) {
	error_log('Paid consultation captcha verification failed: ' . json_encode($captchaResponse['error-codes'] ?? ['verification-unavailable']));
	jsonError('Captcha verification failed. Please try again.');
}

$questionKeys = [
	'registrationNext' => 'Registration after advice', 'formationTimeline' => 'Timeline',
	'strategyFrequency' => 'Engagement frequency', 'strategyTimeline' => 'Timeline',
	'legalDeadline' => 'Deadline attached', 'legalFrequency' => 'Engagement frequency',
	'taxComplexity' => 'Structure complexity', 'taxTimeline' => 'Timeline',
	'marketingStartingPoint' => 'Starting point',
];
$detailRows = '';
foreach ($questionKeys as $key => $label) {
	$value = consultationText($data, $key, 500);
	if ($value !== '') $detailRows .= '<p><strong>' . safe($label) . ':</strong> ' . safe($value) . '</p>';
}

$priority = ($type === 'legal' && consultationText($data, 'legalDeadline', 500) === 'Yes' && $deadlineDetails !== '')
	|| ($type === 'tax' && str_starts_with(consultationText($data, 'taxTimeline', 500), 'Immediate'));
$topicItems = implode('', array_map(static fn($topic) => '<li>' . safe($topic) . '</li>', $topics));

$mail = new PHPMailer(true);
$mail->Host = 'localhost';
$mail->Username = $no_reply_email;
$mail->Password = $no_reply_password;
$mail->Port = 25;
$mail->setFrom($no_reply_email, $company_name);
$mail->addAddress($company_email, $company_name);
$mail->addReplyTo($email, $name);
$mail->Subject = ($priority ? '[PRIORITY] ' : '') . 'New Paid Consultation Request - ' . $typeLabels[$type];
$mail->isHTML(true);
$mail->Body = '<h2>New Paid Consultation Request</h2>'
	. '<p><strong>Priority:</strong> ' . ($priority ? 'Priority follow-up' : 'Standard follow-up') . '</p>'
	. '<p><strong>Consultation:</strong> ' . safe($typeLabels[$type]) . '</p>'
	. '<p><strong>Name:</strong> ' . safe($name) . '</p><p><strong>Company:</strong> ' . safe($company) . '</p>'
	. '<p><strong>Email:</strong> ' . safe($email) . '</p><p><strong>Phone:</strong> ' . safe($phone) . '</p>'
	. '<p><strong>Preferred contact:</strong> ' . safe($contactMethod) . '</p><p><strong>Best time:</strong> ' . safe($contactTime) . '</p>'
	. '<p><strong>Topics:</strong></p><ul>' . $topicItems . '</ul>'
	. ($otherTopic !== '' ? '<p><strong>Other topic:</strong><br>' . nl2br(safe($otherTopic)) . '</p>' : '') . $detailRows
	. ($deadlineDetails !== '' ? '<p><strong>Deadline details:</strong><br>' . nl2br(safe($deadlineDetails)) . '</p>' : '')
	. ($additionalNotes !== '' ? '<p><strong>Additional notes:</strong><br>' . nl2br(safe($additionalNotes)) . '</p>' : '');
$mail->AltBody = "New Paid Consultation Request\nPriority: " . ($priority ? 'Priority follow-up' : 'Standard follow-up')
	. "\nConsultation: {$typeLabels[$type]}\nName: $name\nCompany: $company\nEmail: $email\nPhone: $phone"
	. "\nPreferred contact: $contactMethod\nBest time: $contactTime\nTopics: " . implode(', ', $topics)
	. ($otherTopic !== '' ? "\nOther topic: $otherTopic" : '') . ($deadlineDetails !== '' ? "\nDeadline: $deadlineDetails" : '')
	. ($additionalNotes !== '' ? "\nAdditional notes: $additionalNotes" : '');

try {
	$mail->send();
	jsonSuccess(['priority' => $priority], 'Your consultation request has been sent.');
} catch (Exception $e) {
	error_log('Paid consultation mailer error: ' . $mail->ErrorInfo);
	jsonError('Your request could not be sent. Please try again later.', 500);
}
