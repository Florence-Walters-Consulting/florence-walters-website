<?php
function uploadImage( array $file, string $directory): string {
    if ( $file['error'] !== UPLOAD_ERR_OK ) {
        jsonError('Upload failed.');
    }

    $mime = mime_content_type($file['tmp_name']);

    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];

    if (!isset($allowed[$mime])) {
        jsonError('Invalid image type.');
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
    move_uploaded_file( $file['tmp_name'], $directory . '/' . $filename );
    return $filename;
}