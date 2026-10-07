<?php
function bearerToken(): ?string{
    $headers = getallheaders();
    if (empty($headers['Authorization'])) {
        return null;
    }

    if ( preg_match( '/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
        return $matches[1];
    }

    return null;
}