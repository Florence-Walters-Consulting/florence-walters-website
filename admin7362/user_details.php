<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php 
if (isset($_GET['user_id'])){
	$user_id = mysqli_real_escape_string($con,$_GET['user_id']);
	$stmt = $con -> prepare('SELECT * FROM users WHERE user_id=?');
	$stmt -> bind_param('s',$user_id);
	$stmt -> execute(); 
	$stmt -> store_result(); 
	$stmt -> bind_result($id,$user_id,$first_name,$last_name,$email,$pw,$phone,$date_signed_up); 
	$numrows = $stmt -> num_rows();
	if($numrows > 0){
		while ($stmt -> fetch()) { 

            $nice_date_formatted = date("D, dS M Y g:ia", strtotime($date_signed_up));
		}
	}
	else{echo "<meta http-equiv=\"refresh\" content=\"0; url=index.php\">";exit();}
}
else{echo "<meta http-equiv=\"refresh\" content=\"0; url=index.php\">";exit();}

    $stmt_cart = $con->prepare('SELECT COUNT(id) FROM orders WHERE user_id=?');
    $stmt_cart->bind_param('s',$user_id);
    $stmt_cart->execute(); 
    $stmt_cart->store_result(); 
    $stmt_cart->bind_result($numrows_orders); 
    $stmt_cart->fetch();

    if($numrows_orders > 1){$s="s";} else{$s="";}
	
?>
<?php $page_title = "$first_name $last_name"; $page_title_url = "users_"; ?>
<title><?php echo $company_name; ?> - <?= $page_title ?></title>
<!-- Body main section starts -->

<!-- Body main section starts -->
<main>
    <div class="container-fluid">
        <!-- Breadcrumb start -->
        <div class="row m-1">
            <div class="col-12 ">
                <h4 class="main-title"><?= $first_name ?> <?= $last_name ?></h4>

            </div>
        </div>
        <!-- Breadcrumb end -->

        <!-- Order Details start -->
        <div class="row order-details">
            <div class="col-xxl-12">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card order-details-card">
                            <div class="card-header">
                                <h5 class="text-nowrap">User Details</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between mt-3">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-solid fa-user f-s-18 me-2"></i>Name</h6>
                                    <div class="text-end">
                                        <p><a style='text-decoration:underline;font-weight:700;color:blue;' href='user_details?user_id=<?= $user_id ?>'><?= $first_name ?> <?= $last_name ?></a></p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-solid fa-envelope f-s-18 me-2 text-secondary"></i>Email</h6>
                                    <div class="text-end">
                                        <p><?= $email ?></p>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-phone f-s-18 me-2"></i>Phone</h6>
                                    <div class="text-end">
                                        <p> <?= $phone ?></p>
                                    </div>
                                </div>


                                <div class="d-flex justify-content-between">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-globe f-s-18 me-2"></i>Signed up</h6>
                                    <div class="text-end">
                                        <p> <?= $nice_date_formatted ?></p>
                                    </div>
                                </div>
                                <div>
                                    <button class='btn btn-danger btn-delete-user' data-user-id='<?= $user_id ?>'>
                                        Delete User
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <?php
                $stmt_o = $con -> prepare('SELECT order_id,customer_name,email,phone,address,subtotal,shipping_fee,total,payment_method,payment_reference,payment_status,status,customer_note,created_at FROM orders WHERE user_id=?');
                $stmt_o -> bind_param('s',$user_id);
                $stmt_o -> execute(); 
                $stmt_o -> store_result(); 
                $stmt_o -> bind_result($order_id,$customer_name,$email,$phone,$address,$subtotal,$shipping_fee,$total,$payment_method,$payment_reference,$payment_status,$status,$customer_note,$created_at); 
                $numrows_o = $stmt_o -> num_rows();
                if($numrows_o > 0){
                    
                ?>
                <div class="card">
                    <div class="card-header">
                        <h5>
                            Orders (<?= $numrows_orders ?> item<?= $s ?>)
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="orders-details-datatable app-datatable-default app-scroll table-responsive">
                            <table class="table table-bottom-border text-center align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th class="text-start" scope="col">Order ID</th>
                                        <th scope="col">Customer Data</th>

                                        <th scope="col">Sub Total</th>
                                        <th scope="col">Shipping Fee</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Payment Status</th>
                                        <th scope="col">View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($stmt_o -> fetch()) { 

                                        $nice_date_formatted = date("D, dS M Y g:ia", strtotime($created_at));
                                        ?>
                                    <tr>
                                        <td class="f-w-600"><?= $order_id ?></td>
                                        <td class="f-w-600">
                                            <?php echo "$customer_name <br />
                                            $email <br />
                                            $phone <br />
                                            "; ?>
                                        </td>

                                        <td class="text-success f-w-500"><?= $currency ?><?= number_format($subtotal, 2) ?></td>
                                        <td class="text-success f-w-500"><?= $currency ?><?= number_format($shipping_fee, 2) ?></td>
                                        <td class="text-success f-w-500"><?= $currency ?><?= number_format($total, 2) ?></td>
                                        <td><?= $nice_date_formatted ?></td>
                                        <td><span class="badge text-light-<?= $status=='delivered'?'success':'danger' ?>"><?= $status ?></span></td>
                                        <td><span class="badge text-light-<?= $payment_status=='paid'?'success':'danger' ?>"><?= $payment_status ?></span></td>

                                        <td class="f-w-600"><a href="order_details?order_id=<?= $order_id ?>">View</a></td>


                                    </tr>
                                    <?php }  ?>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">

                    </div>
                </div>
                <?php } else{ echo "<p class='text-center'>No orders found for this user.</p>"; } ?>



            </div>

        </div>
        <!-- Order Details end -->
    </div>
</main>
<!-- Body main section ends -->
<script src="assets/js/jquery-3.6.3.min.js"></script>
<script src="assets/vendor/sweetalert/sweetalert.js"></script>
<script>
$(document).ready(function() {
    $(".btn-delete-user").click(function() {
        const userId = $(this).data("user-id");

        Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete this user and all their orders!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete user"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "ajax/users.php",
                    type: "POST",
                    data: {
                        user_id: userId
                    },
                    dataType: "json",
                    beforeSend: function() {
                        Swal.fire({
                            title: "Deleting...",
                            text: "Please wait",
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                    },
                    success: function(response) {
                        if (response.status === "success") {
                            Swal.fire({
                                icon: "success",
                                title: "Deleted!",
                                text: response.message,
                                showConfirmButton: false,
                                timer: 1500
                            }).then(() => {
                                window.location.href = "users.php"; // redirect after delete
                            });
                        } else {
                            Swal.fire("Error", response.message, "error");
                        }
                    },
                    error: function() {
                        Swal.fire("Error", "An unexpected error occurred.", "error");
                    }
                });
            }
        });
    });
});
</script>

<?php include("footer.php"); ?>