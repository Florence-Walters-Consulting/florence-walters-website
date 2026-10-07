<?php
function envValue(string $key, ?string $default = null): ?string {
    $value = getenv($key);

    if ($value !== false) {
        return $value;
    }

    static $env = null;

    if ($env === null) {
        $env = [];
        $path = dirname(__DIR__, 2) . '/.env';

        if (is_readable($path)) {
            foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);

                if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                    continue;
                }

                [$name, $rawValue] = explode('=', $line, 2);
                $env[trim($name)] = trim(trim($rawValue), "\"'");
            }
        }
    }

    return $env[$key] ?? $default;
}
