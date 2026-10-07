<?php
require '../bootstrap.php';
$data = fetchAll($pdo, 'SELECT id, heading, slug, preamble, slug, tag1, tag2, tag3, tag4 FROM services ORDER BY id ASC');
jsonSuccess($data);