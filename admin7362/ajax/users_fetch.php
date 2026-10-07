<?php include("../../api/config.php");
// ===== Build filters =====
$where = "WHERE 1=1";

if (!empty($_GET['search'])) {
    $search_term = mysqli_real_escape_string($con, $_GET['search']);
    $where .= " AND first_name LIKE '$search_term%' OR last_name LIKE '$search_term%' OR email LIKE '$search_term%'";
}

// ===== Pagination =====
$sql = "SELECT COUNT(id) FROM users $where";
$query = mysqli_query($con, $sql);
$row = mysqli_fetch_row($query);
$rows = $row[0];
$page_rows = 50;
$last = ceil($rows/$page_rows);
if($last < 1){$last = 1;}
$pagenum = isset($_GET['pn']) ? max(1, (int)$_GET['pn']) : 1;
if($pagenum > $last){$pagenum = $last;}
$limit = 'LIMIT ' .($pagenum - 1) * $page_rows .',' .$page_rows;

$sql = "SELECT * FROM users $where ORDER BY id DESC $limit";
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
?>

<div class="col-md-12">
    <h4>Total Users: <?= $rows ?></h4>
</div>

<?php if(mysqli_num_rows($query) > 0): ?>
<div class="table-responsive">
    <table class="table table-bordered table-hover table-striped align-middle mb-0">
        <thead>
            <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Signed Up</th>
                <th>Orders</th>
                <th>View</th>
            </tr>
        </thead>
        <tbody>
            <?php
        $count=0;
        while ($row = mysqli_fetch_assoc($query)):
            $count++;
            $user_id = $row['user_id'];
            $first_name = $row['first_name'];
            $last_name = $row['last_name'];
            $email = $row['email'];
            $phone = $row['phone'];
            $precise_date_formatted = date("D, dS M Y g:ia", strtotime($row['date_signed_up']));

            $stmt_cart = $con->prepare('SELECT COUNT(id) FROM orders WHERE user_id=?');
            $stmt_cart->bind_param('s',$user_id);
            $stmt_cart->execute(); 
            $stmt_cart->store_result(); 
            $stmt_cart->bind_result($numrows_orders); 
            $stmt_cart->fetch();
        ?>
            <tr>
                <td><?= $count ?></td>
                <td><?= $user_id ?></td>
                <td><?= $first_name ?> <?= $last_name ?></td>
                <td><?= $email ?></td>
                <td><?= $phone ?></td>
                <td><?= $precise_date_formatted ?></td>
                <td><?= $numrows_orders ?></td>
                <td><a href="user_details.php?user_id=<?= $user_id ?>">Details</a></td>
            </tr>
            <?php endwhile; ?>

        </tbody>
    </table>

    <div class="pagination mt-3"><?= $paginationCtrls ?></div>
    <div class="text_line mt-2">Page <?= $pagenum ?> of <?= $last ?></div>
</div>
<?php else: ?>
<p>No users found.</p>
<?php endif; ?>