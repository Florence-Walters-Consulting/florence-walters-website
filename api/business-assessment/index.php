<?php
declare(strict_types=1);

require '../bootstrap.php';
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonError('Method not allowed.', 405);
$rawBody = file_get_contents('php://input');
if ($rawBody === false || strlen($rawBody) > 75000) jsonError('Invalid request.');
try {
	$data = json_decode($rawBody, true, 32, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
	jsonError('Invalid request.');
}
if (!is_array($data)) jsonError('Invalid request.');

function assessmentText(array $data, string $key, int $maxLength, bool $required = false): string {
	$value = trim((string) ($data[$key] ?? ''));
	if ($required && $value === '') jsonError('Please complete all required fields.');
	if (mb_strlen($value) > $maxLength) jsonError('One or more fields are too long.');
	return $value;
}
function assessmentSafe(string $value): string {
	return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$firstName = assessmentText($data, 'firstname', 100, true);
$lastName = assessmentText($data, 'lastname', 100, true);
$email = assessmentText($data, 'email', 254, true);
$phone = assessmentText($data, 'phone', 50, true);
$company = assessmentText($data, 'company', 150);
$stage = assessmentText($data, 'stage', 100, true);
$sector = assessmentText($data, 'sector', 100, true);
$budget = assessmentText($data, 'budget', 100, true);
$timeline = assessmentText($data, 'timeline', 100, true);
$mainProblem = assessmentText($data, 'mainProblem', 3000, true);
$captchaToken = assessmentText($data, 'captchaToken', 4096, true);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonError('Please enter a valid email address.');
$allowedStages = ['Idea / pre-launch', 'Newly registered (under 12 months)', 'Operating, 1–5 years', 'Established, 5+ years', 'NGO / non-profit', 'Foreign entity entering Nigeria'];
$allowedSectors = ['Fintech & payments', 'Oil, gas & energy', 'NGO / foundation', 'Education', 'Healthcare & pharma', 'Construction & contracting', 'Professional services', 'Manufacturing', 'Technology', 'Other'];
$allowedBudgets = ['Below ₦250,000', '₦250,000–₦1m', '₦1m–₦5m', 'Above ₦5m'];
$allowedTimelines = ['Immediately', 'Within 30 days', 'Within 90 days', 'Exploring options'];
if (!in_array($stage, $allowedStages, true) || !in_array($sector, $allowedSectors, true)
	|| !in_array($budget, $allowedBudgets, true) || !in_array($timeline, $allowedTimelines, true)) {
	jsonError('Please check your assessment selections.');
}

$branches = $data['branches'] ?? [];
$allowedBranches = ['formation', 'licensing', 'contracts', 'marketing', 'advisory', 'unsure'];
if (!is_array($branches) || count($branches) < 1 || count($branches) > count($allowedBranches)) jsonError('Please select at least one business challenge.');
foreach ($branches as $branch) {
	if (!is_string($branch) || !in_array($branch, $allowedBranches, true)) jsonError('Please check your business challenge selections.');
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
	error_log('Business assessment captcha verification failed: ' . json_encode($captchaResponse['error-codes'] ?? ['verification-unavailable']));
	jsonError('Captcha verification failed. Please try again.');
}

$labels = [
	'turnover' => 'Turnover band', 'employees' => 'Employee count', 'years' => 'Years trading',
	'formationDriver' => 'Formation driver', 'formationCurrent' => 'Current structure', 'foreignPartner' => 'Foreign shareholder/partner', 'cofounders' => 'Co-founders/partners',
	'licensingState' => 'Licensing position', 'regulatorAction' => 'Regulatory action', 'licensingDuration' => 'Time unresolved',
	'customerData' => 'Stores customer data', 'marketingNeed' => 'Marketing need', 'socialPresence' => 'Social media presence',
	'growthGoal' => 'Growth goal', 'financials' => 'Financials/projections',
];
$detailRows = '';
foreach ($labels as $key => $label) {
	$value = assessmentText($data, $key, 500);
	if ($value !== '') $detailRows .= '<p><strong>' . assessmentSafe($label) . ':</strong> ' . assessmentSafe($value) . '</p>';
}
$concerns = $data['contractsConcerns'] ?? [];
if (!is_array($concerns) || count($concerns) > 20) jsonError('Please check your contract concern selections.');
$concerns = array_map(static fn($value) => trim((string) $value), $concerns);
foreach ($concerns as $concern) if ($concern === '' || mb_strlen($concern) > 300) jsonError('Please check your contract concern selections.');

$branchLabels = [
	'formation' => 'Business Formation & Corporate Services', 'licensing' => 'Regulatory Licensing & Compliance',
	'contracts' => 'Contracts, IP & Governance', 'marketing' => 'Marketing', 'advisory' => 'Business Advisory & Growth',
	'unsure' => 'Not sure / diagnostic conversation',
];
$branchItems = implode('', array_map(static fn($branch) => '<li>' . assessmentSafe($branchLabels[$branch]) . '</li>', $branches));
$concernItems = implode('', array_map(static fn($concern) => '<li>' . assessmentSafe($concern) . '</li>', $concerns));
$priority = $timeline === 'Immediately';

$mail = new PHPMailer(true);
$mail->Host = 'localhost';
$mail->Username = $no_reply_email;
$mail->Password = $no_reply_password;
$mail->Port = 25;
$mail->setFrom($no_reply_email, $company_name);
$mail->addAddress($company_email, $company_name);
$mail->addReplyTo($email, "$firstName $lastName");
$mail->Subject = ($priority ? '[PRIORITY] ' : '') . 'New Free Business Assessment - ' . $firstName . ' ' . $lastName;
$mail->isHTML(true);
$mail->Body = '<h2>New Free Business Assessment</h2>'
	. '<p><strong>Name:</strong> ' . assessmentSafe("$firstName $lastName") . '</p><p><strong>Email:</strong> ' . assessmentSafe($email) . '</p>'
	. '<p><strong>Phone:</strong> ' . assessmentSafe($phone) . '</p><p><strong>Company:</strong> ' . assessmentSafe($company ?: 'Not provided') . '</p>'
	. '<p><strong>Business stage:</strong> ' . assessmentSafe($stage) . '</p><p><strong>Sector:</strong> ' . assessmentSafe($sector) . '</p>'
	. '<p><strong>Recommended service areas:</strong></p><ul>' . $branchItems . '</ul>' . $detailRows
	. ($concernItems !== '' ? '<p><strong>Contract/IP/governance concerns:</strong></p><ul>' . $concernItems . '</ul>' : '')
	. '<p><strong>Budget:</strong> ' . assessmentSafe($budget) . '</p><p><strong>Timeline:</strong> ' . assessmentSafe($timeline) . '</p>'
	. '<p><strong>Main problem:</strong><br>' . nl2br(assessmentSafe($mainProblem)) . '</p>';
$mail->AltBody = "New Free Business Assessment\nName: $firstName $lastName\nEmail: $email\nPhone: $phone\nCompany: " . ($company ?: 'Not provided')
	. "\nBusiness stage: $stage\nSector: $sector\nService areas: " . implode(', ', array_map(static fn($branch) => $branchLabels[$branch], $branches))
	. "\nBudget: $budget\nTimeline: $timeline\nMain problem: $mainProblem";

try {
	$mail->send();
	jsonSuccess(['priority' => $priority], 'Your assessment has been submitted.');
} catch (Exception $e) {
	error_log('Business assessment mailer error: ' . $mail->ErrorInfo);
	jsonError('Your assessment could not be submitted. Please try again later.', 500);
}