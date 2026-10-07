<?php
require '../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Invalid request.');
}

$email = trim($_POST['email'] ?? '');
$email = strtolower($email);

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Please enter a valid email address.');
}

$exists = fetchOne(
    $pdo,
    "SELECT id FROM email_subscribers WHERE email = ? LIMIT 1",
    [$email]
);

if ($exists) {
    jsonSuccess(null, 'You are already subscribed.');
}

try {
    $insert = execute(
        $pdo,
        "INSERT INTO email_subscribers (email, date) VALUES (?, NOW())",
        [$email]
    );
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        jsonSuccess(null, 'You are already subscribed.');
    }
    jsonError('We could not complete your subscription. Please try again.', 500);
}

if (!$insert) {
    jsonError('We could not complete your subscription. Please try again.', 500);
}

jsonSuccess(null, 'Thank you for subscribing.');
