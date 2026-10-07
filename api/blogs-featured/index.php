<?php
require '../bootstrap.php';
$yes = "Yes";
$data = fetchAll(
    $pdo,
    "SELECT
        b.id,
        b.heading,
        b.slug,
        b.category,
        bc.category_name,
        b.preamble,
        b.picture,
        b.date
     FROM blog b
     LEFT JOIN blog_categories bc ON bc.id = b.category
     WHERE b.featured = ?
     ORDER BY b.id DESC
     LIMIT 3",
    [$yes]
);
jsonSuccess($data);
