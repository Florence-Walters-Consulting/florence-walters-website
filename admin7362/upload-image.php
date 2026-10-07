<?php
include('../config.php');
ini_set('display_errors', 1);
error_reporting(E_ALL);
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = __DIR__ . '/../site_img/summernote/';
    //$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/site_img/summernote/';
    $filename = time() . '_' . basename($_FILES['file']['name']);
    $targetPath = $uploadDir . $filename;

    $url = $link . '/site_img/summernote/' . $filename;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
        echo json_encode(['url' => $url]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid upload request.']);
}
?>