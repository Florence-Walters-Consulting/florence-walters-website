<?php
function body(): array{
    $data = json_decode( file_get_contents('php://input'), true );
    return is_array($data) ? $data : [];
}

function requireFields( array $data, array $fields ): void{
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
            jsonError("$field is required.", 422);
        }
    }
}