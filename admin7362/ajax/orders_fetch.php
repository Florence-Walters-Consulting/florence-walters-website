<?php include("../../api/config.php");
// ===== Build filters =====
$where = "WHERE 1=1";

if (!empty($_GET['status'])) {
    $status = mysqli_real_escape_string($con, $_GET['status']);
    $where .= " AND status = '$status'";
}

if (!empty($_GET['from_date']) && !empty($_GET['to_date'])) {
    $from_date = mysqli_real_escape_string($con, $_GET['from_date']);
    $to_date = mysqli_real_escape_string($con, $_GET['to_date']);
    $where .= " AND DATE(created_at) BETWEEN '$from_date' AND '$to_date'";
} elseif (!empty($_GET['from_date'])) {
    $from_date = mysqli_real_escape_string($con, $_GET['from_date']);
    $where .= " AND DATE(created_at) >= '$from_date'";
} elseif (!empty($_GET['to_date'])) {
    $to_date = mysqli_real_escape_string($con, $_GET['to_date']);
    $where .= " AND DATE(date) <= '$to_date'";
}

// ===== Pagination =====
$sql = "SELECT COUNT(id) FROM orders $where";
$query = mysqli_query($con, $sql);
$row = mysqli_fetch_row($query);
$rows = $row[0];
$page_rows = 50;
$last = ceil($rows/$page_rows);
if($last < 1){$last = 1;}
$pagenum = isset($_GET['pn']) ? max(1, (int)$_GET['pn']) : 1;
if($pagenum > $last){$pagenum = $last;}
$limit = 'LIMIT ' .($pagenum - 1) * $page_rows .',' .$page_rows;

$sql = "SELECT * FROM orders $where ORDER BY id DESC $limit";
$query = mysqli_query($con, $sql);

// ===== Pagination links =====
$paginationCtrls = "";
if($last != 1){
    $query_string = $_GET;
    unset($query_string['pn']);
    $query_str = http_build_query($query_string);

    if($pagenum > 1){
        $previous = $pagenum - 1;
        $paginationCtrls .= "<a href='?pn=$previous&$query_str' class='page-link'>&laquo; Prev</a>";
        for($i = $pagenum-4; $i < $pagenum; $i++){
            if($i > 0){ $paginationCtrls .= "<a href='?pn=$i&$query_str' class='page-link'>$i</a>"; }
        }
    }

    $paginationCtrls .= "<a href='#' class='page-link active'>$pagenum</a>";
    for($i = $pagenum+1; $i <= $last; $i++){
        $paginationCtrls .= "<a href='?pn=$i&$query_str' class='page-link'>$i</a>";
        if($i >= $pagenum+4){ break; }
    }
    if($pagenum != $last){
        $next = $pagenum + 1;
        $paginationCtrls .= "<a href='?pn=$next&$query_str' class='page-link'>Next &raquo;</a>";
    }
}

$grand_t_amount=0;
$stmt_total = $con->prepare("SELECT subtotal FROM orders $where");
$stmt_total->execute();
$stmt_total->store_result();
$stmt_total->bind_result($t_amount);
while ($stmt_total->fetch()) { $grand_t_amount += $t_amount; }
?>

<div class="col-md-12">
    <h4>Total Orders: <?= $rows ?> <br>Total Amount: <?= $currency ?><?= number_format($grand_t_amount, 2) ?></h4>
</div>

<?php if(mysqli_num_rows($query) > 0): ?>
<div class="table-responsive">
    <table class="table table-bordered table-hover table-striped align-middle mb-0">
        <thead>
            <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>View</th>
            </tr>
        </thead>
        <tbody>
            <?php
        $count=0; $grand_total=0;
        while ($row = mysqli_fetch_assoc($query)):
            $count++;
            $order_id = $row['order_id'];
            $customer_name = $row['customer_name'];
            $order_status = $row['status'];
            $user_id = $row['user_id'];
            $total = $row['subtotal'];
            $precise_date_formatted = date("D, dS M Y g:ia", strtotime($row['created_at']));
            $payment_method = $row['payment_method'];
            $grand_total += $total;

            $stmt_cart = $con->prepare('SELECT COUNT(id) FROM order_items WHERE order_id=?');
            $stmt_cart->bind_param('s',$order_id);
            $stmt_cart->execute(); 
            $stmt_cart->store_result(); 
            $stmt_cart->bind_result($numrows_cart); 
            $stmt_cart->fetch();
        ?>
            <tr>
                <td><?= $count ?></td>
                <td><?= $order_id ?></td>
                <td><?= $precise_date_formatted ?></td>
                <td><span class="badge bg-<?= $order_status=='delivered'?'success':'danger' ?>"><?= $order_status ?></span></td>
                <td><?= $customer_name ?></td>
                <td><?= $numrows_cart ?></td>
                <td class="text-success"><?= $currency ?><?= number_format($total, 2) ?></td>
                <td><?= $payment_method ?></td>
                <td><a href="order_details.php?order_id=<?= $order_id ?>">Details</a></td>
            </tr>
            <?php endwhile; ?>
            <tr>
                <td colspan="6"><strong>Grand Total</strong></td>
                <td class="text-success"><strong><?= $currency ?><?= number_format($grand_total, 2) ?></strong></td>
                <td colspan="2"></td>
            </tr>
        </tbody>
    </table>

    <div class="pagination mt-3"><?= $paginationCtrls ?></div>
    <div class="text_line mt-2">Page <?= $pagenum ?> of <?= $last ?></div>
</div>
<?php else: ?>
<p>No orders found.</p>
<?php endif; ?>