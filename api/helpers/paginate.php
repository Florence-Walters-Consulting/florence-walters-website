<?php function paginate(PDO $pdo, string $table, int $page = 1, int $limit = 10)
{
    $page = max(1, $page);
    $offset = ($page - 1) * $limit;

    $total = fetchValue(
        $pdo,
        "SELECT COUNT(*) FROM {$table}"
    );

    $data = fetchAll(
        $pdo,
        "SELECT *
         FROM {$table}
         ORDER BY id DESC
         LIMIT {$limit}
         OFFSET {$offset}"
    );

    return [
        'data' => $data,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => (int)$total,
            'totalPages' => ceil($total / $limit),
        ]
    ];
}