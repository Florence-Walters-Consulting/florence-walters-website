<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require '../bootstrap.php';
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../helpers/contact_security.php';

header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    jsonError('Method not allowed.', 405);
}

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') {
    jsonError('Content-Type must be application/json.', 415);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 16384) {
    jsonError('Request payload is too large.', 413);
}

try {
    $data = json_decode($rawBody, true, 32, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    jsonError('Invalid JSON request.', 400);
}
if (!is_array($data)) {
    jsonError('Invalid request.', 400);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = array_filter(array_map('trim', explode(',', envValue(
    'CONTACT_ALLOWED_ORIGINS',
    'http://localhost:5173,http://localhost,https://omoniposofela.com,https://www.omoniposofela.com'
) ?? '')));
if ($origin !== '' && !in_array($origin, $allowedOrigins, true)) {
    jsonError('Invalid request origin.', 403);
}

$clientIp = contactClientIp();
enforceContactRateLimit('contact:global', 120, 3600);
enforceContactRateLimit('contact:ip:10m:' . $clientIp, 6, 600);
enforceContactRateLimit('contact:ip:day:' . $clientIp, 30, 86400);

// Bots commonly fill fields hidden from real users. Return a neutral success so the trap is not disclosed.
if (trim((string) ($data['website'] ?? '')) !== '') {
    jsonSuccess(null, 'Message sent successfully. We will get back to you soon.');
}

$startedAt = filter_var($data['form_started_at'] ?? null, FILTER_VALIDATE_INT);
$elapsedMilliseconds = $startedAt ? (int) floor(microtime(true) * 1000) - (int) $startedAt : 0;
if (!$startedAt || $elapsedMilliseconds < 2500 || $elapsedMilliseconds > 7200000) {
    jsonError('Please reload the form and try again.', 422);
}

$fields = [
    'first_name' => trim((string) ($data['first_name'] ?? '')),
    'last_name' => trim((string) ($data['last_name'] ?? '')),
    'email' => strtolower(trim((string) ($data['email'] ?? ''))),
    'phone' => trim((string) ($data['phone'] ?? '')),
    'company' => trim((string) ($data['company'] ?? '')),
    'subject' => trim((string) ($data['subject'] ?? '')),
    'message' => trim((string) ($data['message'] ?? '')),
];

foreach (['first_name', 'last_name', 'email', 'phone', 'subject', 'message'] as $required) {
    if ($fields[$required] === '') {
        jsonError('Please fill all required fields.', 422);
    }
}

$limits = [
    'first_name' => 80,
    'last_name' => 80,
    'email' => 254,
    'phone' => 40,
    'company' => 120,
    'subject' => 160,
    'message' => 5000,
];
foreach ($limits as $field => $maximum) {
    if (contactTextLength($fields[$field]) > $maximum) {
        jsonError('One or more fields are too long.', 422);
    }
}

if (contactTextLength($fields['message']) < 20) {
    jsonError('Please provide a little more detail in your message.', 422);
}
if (!filter_var($fields['email'], FILTER_VALIDATE_EMAIL)) {
    jsonError('Please enter a valid email address.', 422);
}
if (preg_match('/[\r\n\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', implode('', [
    $fields['first_name'], $fields['last_name'], $fields['email'], $fields['phone'],
    $fields['company'], $fields['subject'],
]))) {
    jsonError('One or more fields contain invalid characters.', 422);
}
if (preg_match_all('/(?:https?:\/\/|www\.)/iu', $fields['message']) > 3) {
    jsonError('Please remove excessive links from your message.', 422);
}
if (preg_match('/(.)\1{14,}/u', $fields['message'])) {
    jsonError('Please remove excessive repeated characters from your message.', 422);
}

$captchaToken = trim((string) ($data['captchaToken'] ?? ''));
if ($captchaToken === '' || strlen($captchaToken) > 4096) {
    jsonError('Captcha verification is required.', 422);
}
verifyContactCaptcha($captchaToken, $clientIp);

enforceContactRateLimit('contact:email:' . hash('sha256', $fields['email']), 3, 3600);
$fingerprint = hash('sha256', $fields['email'] . "\n" . $fields['subject'] . "\n" . $fields['message']);
[$isNewMessage] = contactRateLimit('contact:duplicate:' . $fingerprint, 1, 1800);
if (!$isNewMessage) {
    jsonSuccess(null, 'Message sent successfully. We will get back to you soon.');
}

$escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeMessage = nl2br($escape($fields['message']));

$mail = new PHPMailer(true);
$mail->Host = 'localhost';
$mail->Username = $no_reply_email;
$mail->Password = $no_reply_password;
$mail->Port = 25;
$mail->CharSet = PHPMailer::CHARSET_UTF8;
$mail->setFrom($no_reply_email, $company_name);
$mail->addAddress($company_email, $company_name);
$mail->addReplyTo($fields['email'], $fields['first_name'] . ' ' . $fields['last_name']);
$mail->Subject = 'New Contact Form Submission: ' . $fields['subject'];
$mail->isHTML(true);
$mail->Body = sprintf(
    '<h2>New Contact Form Submission</h2><p><strong>Name:</strong> %s %s</p><p><strong>Email:</strong> %s</p><p><strong>Phone:</strong> %s</p><p><strong>Company/Organization:</strong> %s</p><p><strong>Subject:</strong> %s</p><p><strong>Message:</strong></p><p>%s</p>',
    $escape($fields['first_name']), $escape($fields['last_name']), $escape($fields['email']),
    $escape($fields['phone']), $escape($fields['company'] ?: 'Not provided'),
    $escape($fields['subject']), $safeMessage
);
$mail->AltBody = sprintf(
    "New Contact Form Submission\nName: %s %s\nEmail: %s\nPhone: %s\nCompany/Organization: %s\nSubject: %s\n\nMessage:\n%s",
    $fields['first_name'], $fields['last_name'], $fields['email'], $fields['phone'],
    $fields['company'] ?: 'Not provided', $fields['subject'], $fields['message']
);

try {
    $mail->send();
    jsonSuccess(null, 'Message sent successfully. We will get back to you soon.');
} catch (Exception) {
    error_log('Contact form mail delivery failed: ' . $mail->ErrorInfo);
    jsonError('Message could not be sent. Please try again later.', 500);
}
