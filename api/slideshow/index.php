<?php
require '../bootstrap.php';
$data = fetchAll( $pdo, " SELECT id, heading, paragraph, picture FROM picture_slider");
jsonSuccess($data);