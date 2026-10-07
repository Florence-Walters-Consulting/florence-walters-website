<?php
require '../bootstrap.php';
$yes = "Yes";
$data = fetchAll($pdo, "SELECT id, name, position, picture, link FROM team ORDER BY id ASC");
jsonSuccess($data);