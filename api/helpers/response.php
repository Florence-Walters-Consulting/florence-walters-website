<?php
function jsonSuccess($data = null, string|int|null $message = null, int $status = 200): never{
    if (is_int($message)) {
        $status = $message;
        $message = null;
    }

    http_response_code($status);
    $response = [
        'success' => true,
        'data' => $data
    ];

    if ($message !== null) {
        $response['message'] = $message;
    }

    echo json_encode($response);
    exit;
}

function jsonError(string $message, int $status = 400): never{
    http_response_code($status);
    echo json_encode([
        'success' => false,
        'message' => $message
    ]);
    exit;
}
