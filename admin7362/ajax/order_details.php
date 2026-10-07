<?php
include("../../api/config.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$order_id = trim($_POST['order_id'] ?? '');
$payment_status = trim($_POST['payment_status'] ?? '');
$status = trim($_POST['status'] ?? '');

$allowed_payment_statuses = ['unpaid', 'paid', 'failed', 'refunded'];
$allowed_statuses = ['pending', 'processing', 'shipped', 'delivered'];

if ($order_id === '') {
    echo json_encode(['status' => 'error', 'message' => 'Order ID is required.']);
    exit;
}

if (!in_array($payment_status, $allowed_payment_statuses, true)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid payment status.']);
    exit;
}

if (!in_array($status, $allowed_statuses, true)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid order status.']);
    exit;
}

$stmt = $con->prepare('UPDATE orders SET payment_status = ?, status = ? WHERE order_id = ?');
$stmt->bind_param('sss', $payment_status, $status, $order_id);
$stmt->execute();

if ($stmt->affected_rows < 1) {
    $check = $con->prepare('SELECT COUNT(id) FROM orders WHERE order_id = ?');
    $check->bind_param('s', $order_id);
    $check->execute();
    $check->bind_result($exists);
    $check->fetch();

    if ((int)$exists < 1) {
        echo json_encode(['status' => 'error', 'message' => 'Order was not found.']);
        exit;
    }
}

echo json_encode(['status' => 'success', 'message' => 'Order status successfully updated.']);
