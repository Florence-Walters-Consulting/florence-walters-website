<?php
require '../bootstrap.php';

$slug = trim((string) ($_GET['slug'] ?? ''));

if ($slug === '') {
    jsonError('Blog slug is required.', 400);
}

$blog = fetchOne(
    $pdo,
    "SELECT
        b.id,
        b.blog_id,
        b.heading,
        b.slug,
        b.category,
        bc.category_name,
        b.preamble,
        b.body,
        b.picture,
        b.date,
        b.comments_allowed
     FROM blog b
     LEFT JOIN blog_categories bc ON bc.id = b.category
     WHERE b.slug = ?
     LIMIT 1",
    [$slug]
);

if (!$blog) {
    jsonError('Blog post not found.', 404);
}

$previous = fetchOne(
    $pdo,
    "SELECT id, heading, slug
     FROM blog
     WHERE id < ?
     ORDER BY id DESC
     LIMIT 1",
    [$blog['id']]
);

$next = fetchOne(
    $pdo,
    "SELECT id, heading, slug
     FROM blog
     WHERE id > ?
     ORDER BY id ASC
     LIMIT 1",
    [$blog['id']]
);

$related = fetchAll(
    $pdo,
    "SELECT id, heading, slug, preamble, picture, date
     FROM blog
     WHERE category = ? AND id <> ?
     ORDER BY id DESC
     LIMIT 3",
    [$blog['category'], $blog['id']]
);

jsonSuccess([
    'blog' => $blog,
    'previous' => $previous,
    'next' => $next,
    'related' => $related,
]);
