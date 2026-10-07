<?php
require '../bootstrap.php';
$data = fetchAll(
    $pdo,
    "
    SELECT
        picture,
        size
    FROM general_images
    WHERE display = ?
    ",
    ['Yes']
);

jsonSuccess($data);