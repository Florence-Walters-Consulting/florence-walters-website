<?php
require '../bootstrap.php';
$yes = "Yes";
$data = fetchAll( $pdo, " SELECT id, name, occupation, body, picture FROM testimonials WHERE display = ? ORDER BY RAND()",[$yes]);
jsonSuccess($data);