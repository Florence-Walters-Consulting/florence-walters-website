<?php
require '../bootstrap.php';
$data = fetchAll( $pdo, " SELECT id, picture FROM partners ORDER BY RAND()");
jsonSuccess($data);