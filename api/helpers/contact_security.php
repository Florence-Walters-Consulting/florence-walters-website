<?php
declare(strict_types=1);

function contactClientIp(): string {
    $remote = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $trusted = array_filter(array_map('trim', explode(',', envValue('TRUSTED_PROXY_IPS', '') ?? '')));

    if (in_array($remote, $trusted, true)) {
        $forwarded = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0] ?? '');
        if (filter_var($forwarded, FILTER_VALIDATE_IP)) {
            return $forwarded;
        }
    }

    return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : 'unknown';
}

function contactRateLimit(string $bucket, int $limit, int $windowSeconds): array {
    $directory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'omoniposofela-contact-limits';
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Unable to initialize contact rate limiting.');
    }

    $path = $directory . DIRECTORY_SEPARATOR . hash('sha256', $bucket) . '.json';
    $handle = fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) {
            fclose($handle);
        }
        throw new RuntimeException('Unable to lock contact rate limit data.');
    }

    $now = time();
    $contents = stream_get_contents($handle);
    $timestamps = json_decode($contents ?: '[]', true);
    $timestamps = is_array($timestamps) ? array_values(array_filter(
        $timestamps,
        static fn ($timestamp): bool => is_int($timestamp) && $timestamp > $now - $windowSeconds
    )) : [];

    $allowed = count($timestamps) < $limit;
    $retryAfter = $allowed || $timestamps === [] ? 0 : max(1, $timestamps[0] + $windowSeconds - $now);
    if ($allowed) {
        $timestamps[] = $now;
    }

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($timestamps, JSON_THROW_ON_ERROR));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return [$allowed, $retryAfter];
}

function enforceContactRateLimit(string $bucket, int $limit, int $windowSeconds): void {
    [$allowed, $retryAfter] = contactRateLimit($bucket, $limit, $windowSeconds);
    if (!$allowed) {
        header('Retry-After: ' . $retryAfter);
        jsonError('Too many requests. Please wait before trying again.', 429);
    }
}

function verifyContactCaptcha(string $token, string $clientIp): void {
    $secret = envValue('RECAPTCHA_SECRET_KEY', '');
    if (!$secret) {
        error_log('Contact form: RECAPTCHA_SECRET_KEY is not configured.');
        jsonError('The contact form is temporarily unavailable.', 503);
    }

    $payload = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $clientIp,
    ], '', '&', PHP_QUERY_RFC3986);

    $responseBody = false;
    if (function_exists('curl_init')) {
        $curl = curl_init('https://www.google.com/recaptcha/api/siteverify');
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT => 7,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $responseBody = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $curlError = curl_error($curl);
        curl_close($curl);
        if ($responseBody === false || $status !== 200) {
            error_log('Contact form: reCAPTCHA request failed: ' . ($curlError ?: 'HTTP ' . $status));
            jsonError('Captcha verification is temporarily unavailable.', 503);
        }
    } else {
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\nConnection: close\r\n",
            'content' => $payload,
            'timeout' => 7,
            'ignore_errors' => true,
        ]]);
        $responseBody = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
        if ($responseBody === false) {
            error_log('Contact form: reCAPTCHA request failed without cURL.');
            jsonError('Captcha verification is temporarily unavailable.', 503);
        }
    }

    $result = json_decode((string) $responseBody, true);
    if (!is_array($result) || empty($result['success'])) {
        $codes = is_array($result['error-codes'] ?? null) ? implode(',', $result['error-codes']) : 'unknown';
        error_log('Contact form: rejected reCAPTCHA token: ' . $codes);
        jsonError('Captcha verification failed. Please complete it again.', 422);
    }

    $allowedHosts = array_filter(array_map(
        static fn (string $host): string => strtolower(trim($host)),
        explode(',', envValue('RECAPTCHA_ALLOWED_HOSTNAMES', 'localhost,127.0.0.1,omoniposofela.com,www.omoniposofela.com') ?? '')
    ));
    $hostname = strtolower((string) ($result['hostname'] ?? ''));
    if ($hostname === '' || !in_array($hostname, $allowedHosts, true)) {
        error_log('Contact form: reCAPTCHA hostname mismatch: ' . $hostname);
        jsonError('Captcha verification failed. Please complete it again.', 422);
    }

    $challengeTime = strtotime((string) ($result['challenge_ts'] ?? ''));
    if ($challengeTime === false || $challengeTime < time() - 120 || $challengeTime > time() + 30) {
        error_log('Contact form: stale or invalid reCAPTCHA challenge timestamp.');
        jsonError('Captcha expired. Please complete it again.', 422);
    }
}

function contactTextLength(string $value): int {
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

