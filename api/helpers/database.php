<?php
function fetchAll(PDO $pdo, string $sql, array $params = []): array {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC); 
}

function fetchOne(PDO $pdo, string $sql, array $params = []): ?array{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $result = $stmt->fetch();
    return $result ?: null;
}

function fetchValue(PDO $pdo, string $sql, array $params = []): mixed{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchColumn();
}

function execute(PDO $pdo, string $sql, array $params = []): bool{
    $stmt = $pdo->prepare($sql);
    return $stmt->execute($params);
}
