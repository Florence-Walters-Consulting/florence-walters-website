<?php
declare(strict_types=1);
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/helpers/config.php';
require __DIR__ . '/config.php';
require __DIR__ . '/helpers/response.php';
require __DIR__ . '/helpers/database.php';
require __DIR__ . '/helpers/request.php';
require __DIR__ . '/helpers/paginate.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
set_exception_handler(function (Throwable $e) {

    error_log(
        sprintf(
            "[%s] %s in %s:%d",
            get_class($e),
            $e->getMessage(),
            $e->getFile(),
            $e->getLine()
        )
    );

    jsonError('Something went wrong.', 500);
});
