<?php
function paystackSecretKey(): string {
	$secret = envValue('PAYSTACK_SECRET_KEY', '');

	if ($secret === '') {
		throw new RuntimeException('Paystack secret key is not configured.');
	}

	return $secret;
}

function paystackRequest(string $method, string $path, ?array $payload = null): array {
    $ch = curl_init('https://api.paystack.co' . $path);
    $headers = [
        'Authorization: Bearer ' . paystackSecretKey(),
        'Content-Type: application/json',
    ];

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
    ]);

    if ($payload !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    }

    $body = curl_exec($ch);
    $error = curl_error($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

	if ($body === false) {
		throw new RuntimeException($error ?: 'Unable to reach Paystack.');
	}

	$data = json_decode($body, true);

	if (!is_array($data)) {
		throw new RuntimeException('Invalid response from Paystack.');
	}

	if ($status < 200 || $status >= 300 || !($data['status'] ?? false)) {
		throw new RuntimeException($data['message'] ?? 'Paystack request failed.');
	}

    return $data;
}
