<?php
require '../bootstrap.php';

$slug = trim((string) ($_GET['slug'] ?? ''));

if ($slug === '') {
    jsonError('Service slug is required.', 400);
}

$service = fetchOne(
    $pdo,
    'SELECT id, heading, preamble, slug, body FROM services WHERE slug = ? LIMIT 1',
    [$slug]
);

if (!$service) {
    jsonError('Service not found.', 404);
}

jsonSuccess([
    'service' => $service,
]);