<?php
require '../bootstrap.php';
$data = fetchAll($pdo, 'SELECT id, question, body FROM faqs ORDER BY id ASC');
jsonSuccess($data);
