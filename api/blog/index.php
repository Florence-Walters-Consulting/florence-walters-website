<?php
require '../bootstrap.php';
$page = (int)($_GET['page'] ?? 1);
$limit = 6;
$page = max(1, $page);
$offset = ($page - 1) * $limit;
$search = trim((string) ($_GET['search'] ?? ''));
$category = max(0, (int) ($_GET['category'] ?? 0));
$where = [];
$params = [];

if ($search !== '') {
    $where[] = '(b.heading LIKE ? OR b.preamble LIKE ? OR bc.category_name LIKE ?)';
    $term = '%' . $search . '%';
    array_push($params, $term, $term, $term);
}

if ($category > 0) {
    $where[] = 'b.category = ?';
    $params[] = $category;
}

$whereSql = $where ? ' WHERE ' . implode(' AND ', $where) : '';

$total = (int) fetchValue(
    $pdo,
    'SELECT COUNT(*) FROM blog b LEFT JOIN blog_categories bc ON bc.id = b.category' . $whereSql,
    $params
);

$blogs = fetchAll(
    $pdo,
    "SELECT
        b.id,
        b.blog_id,
        b.heading,
        b.slug,
        b.category,
        bc.category_name,
        b.preamble,
        b.picture,
        b.featured,
        b.date,
        b.comments_allowed
     FROM blog b
     LEFT JOIN blog_categories bc ON bc.id = b.category" . $whereSql . "
     ORDER BY b.id DESC
     LIMIT {$limit}
     OFFSET {$offset}",
    $params
);

$categories = fetchAll(
    $pdo,
    "SELECT
        bc.id,
        bc.category_name,
        COUNT(b.id) AS count
     FROM blog_categories bc
     LEFT JOIN blog b ON b.category = bc.id
     GROUP BY bc.id, bc.category_name
     ORDER BY bc.category_name ASC"
);

$recent = fetchAll(
    $pdo,
    "SELECT id, heading, slug, picture, date
     FROM blog
     ORDER BY id DESC
     LIMIT 3"
);

$tags = array_values(array_map(
    fn (array $category): string => $category['category_name'],
    array_filter($categories, fn (array $category): bool => (int) $category['count'] > 0)
));

jsonSuccess([
    'data' => $blogs,
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'totalPages' => (int) ceil($total / $limit),
    ],
    'categories' => $categories,
    'recent' => $recent,
    'tags' => array_slice($tags, 0, 12),
]);
