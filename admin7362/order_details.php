<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php 
if (isset($_GET['order_id'])){
	$order_id = mysqli_real_escape_string($con,$_GET['order_id']);
	$stmt = $con -> prepare('SELECT id, user_id,order_id,customer_name,email,phone,address,subtotal,shipping_fee,total,payment_method,payment_reference,payment_status,status,customer_note,created_at FROM orders WHERE order_id=?');
	$stmt -> bind_param('s',$order_id);
	$stmt -> execute(); 
	$stmt -> store_result(); 
	$stmt -> bind_result($id, $user_id, $order_id, $customer_name, $email, $phone, $address,$subtotal, $shipping_fee, $total, $payment_method, $payment_reference, $payment_status, $status, $customer_note, $created_at); 
	$numrows = $stmt -> num_rows();
	if($numrows > 0){
		while ($stmt -> fetch()) { 

		    if($status=="pending"){$status_color="red";}
		    if($status=="delivered"){$status_color="forestgreen";}

            $nice_date_formatted = date("D, dS M Y g:ia", strtotime($created_at));
		}
	}
	else{echo "<meta http-equiv=\"refresh\" content=\"0; url=index.php\">";exit();}
}
else{echo "<meta http-equiv=\"refresh\" content=\"0; url=index.php\">";exit();}

    $stmt_cart = $con->prepare('SELECT COUNT(id) FROM order_items WHERE order_id=?');
    $stmt_cart->bind_param('s',$order_id);
    $stmt_cart->execute(); 
    $stmt_cart->store_result(); 
    $stmt_cart->bind_result($numrows_cart); 
    $stmt_cart->fetch();

    if($numrows_cart > 1){$s="s";} else{$s="";}
	
?>
<?php $page_title = "$order_id ($customer_name)"; $page_title_url = "partners_"; ?>
<title><?php echo $company_name; ?> - <?= $page_title ?></title>
<!-- Body main section starts -->

<!-- Body main section starts -->
<main>
    <div class="container-fluid">
        <!-- Breadcrumb start -->
        <div class="row m-1">
            <div class="col-12 ">
                <h4 class="main-title">ORDER ID: <?= $order_id ?></h4>

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
                                <h5 class="text-nowrap">Order Details</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between mt-3">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-solid fa-hashtag f-s-18 me-2"></i>Items</h6>
                                    <div class="text-end">
                                        <p><?= $numrows_cart ?></p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-solid fa-calendar f-s-18 me-2 text-secondary"></i>Date</h6>
                                    <div class="text-end">
                                        <p><?= $nice_date_formatted ?></p>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-credit-card f-s-18 me-2"></i>Payment Method</h6>
                                    <div class="text-end">
                                        <p> <?= $payment_method ?></p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-money-check-dollar f-s-18 me-2"></i>Product Total</h6>
                                    <div class="text-end">
                                        <p> <?= $currency ?><?= number_format($subtotal, 2) ?></p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-truck f-s-18 me-2"></i>Shipping Fee</h6>
                                    <div class="text-end">
                                        <p> <?= $currency ?><?= number_format($shipping_fee, 2) ?></p>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card order-details-card">
                            <div class="card-header">
                                <h5 class="text-nowrap">Customer Details</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between mt-3">
                                    <h6 class="f-w-600 text-dark"><i
                                            class="fa fa-solid fa-user f-s-18 me-2"></i>Name</h6>
                                    <div class="text-end">
                                        <p><a style='text-decoration:underline;font-weight:700;color:blue;'
                                                <?php if($user_id !== "" ){ ?>
                                                href='user_details?user_id=<?= $user_id ?>'
                                                <?php } ?>>
                                                <?= $customer_name ?>
                                            </a></p>
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
                                            class="fa fa-location f-s-18 me-2"></i>Address(Delivery Zone)</h6>
                                    <div class="text-end">
                                        <p> <?= $address ?></p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>



                <div class="card">
                    <div class="card-header">
                        <h5>
                            Order Items (<?= $numrows_cart ?> item<?= $s ?>)
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="orders-details-datatable app-datatable-default app-scroll table-responsive">
                            <table class="table table-bottom-border text-center align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th class="text-start" scope="col">Product Details</th>
                                        <th>Status</th>
                                        <th scope="col">Order Date</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Sub Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                $stmt1 = $con -> prepare('SELECT * FROM order_items WHERE order_id=?');
                                $stmt1 -> bind_param('s',$order_id);
                                $stmt1 -> execute(); 
                                $stmt1 -> store_result(); 
                                $stmt1 -> bind_result($id,$order_id,$product_id,$product_name,$price,$quantity,$subtotal,$picture); 
                                $numrows1 = $stmt1 -> num_rows();
                                if($numrows1 > 0){
                                    while ($stmt1 -> fetch()) { ?>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <img alt="product-img" class="h-50 bg-light-secondary b-r-10"
                                                    src="../site_img/products/<?= $picture ?>">
                                                <div class="text-start">
                                                    <h6 class="mb-0"> <?= $product_name ?></h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span class="badge text-light-<?= $status=='delivered'?'success':'danger' ?>"><?= $status ?></span></td>
                                        <td><?= $nice_date_formatted ?></td>
                                        <td class="text-success f-w-500"><?= $currency ?><?= number_format($price, 2) ?></td>
                                        <td class="f-w-600"><?= $quantity ?></td>
                                        <td class="text-success f-w-500"><?= $currency ?><?= number_format($subtotal, 2) ?></td>


                                    </tr>
                                    <?php } } ?>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">

                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h5>
                            Transaction Details
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="orders-details-datatable app-datatable-default app-scroll table-responsive">
                            <table class="table table-bottom-border text-center align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th class="text-start" scope="col">Payment method</th>
                                        <th scope="col">Transaction Reference</th>
                                        <th>Payment Status</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Payment Method</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr>
                                        <td><?= $payment_method ?></td>
                                        <td><?= $payment_reference ?></td>
                                        <td><span class="badge text-light-<?= $payment_status=='paid'?'success':'danger' ?>"><?= $payment_status ?></span></td>
                                        <td class="f-w-600"><?= $currency ?><?= number_format($total, 2); ?></td>
                                        <td><?= $payment_method ?></td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">

                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h5>
                            Update Order Status
                        </h5>
                    </div>
                    <div class="card-body">
                        <form id="orderStatusForm" class="row g-3">
                            <input type="hidden" name="order_id" value="<?= $order_id ?>">
                            <div class="col-md-5">
                                <label class="form-label">Payment Status</label>
                                <select name="payment_status" class="form-control" required>
                                    <option value="unpaid" <?= $payment_status === 'unpaid' ? 'selected' : '' ?>>Unpaid</option>
                                    <option value="paid" <?= $payment_status === 'paid' ? 'selected' : '' ?>>Paid</option>
                                    <option value="failed" <?= $payment_status === 'failed' ? 'selected' : '' ?>>Failed</option>
                                    <option value="refunded" <?= $payment_status === 'refunded' ? 'selected' : '' ?>>Refunded</option>
                                </select>
                            </div>
                            <div class="col-md-5">
                                <label class="form-label">Order Status</label>
                                <select name="status" class="form-control" required>
                                    <option value="pending" <?= $status === 'pending' ? 'selected' : '' ?>>Pending</option>
                                    <option value="processing" <?= $status === 'processing' ? 'selected' : '' ?>>Processing</option>
                                    <option value="shipped" <?= $status === 'shipped' ? 'selected' : '' ?>>Shipped</option>
                                    <option value="delivered" <?= $status === 'delivered' ? 'selected' : '' ?>>Delivered</option>
                                </select>
                            </div>
                            <div class="col-md-2 d-flex align-items-end">
                                <button type="submit" class="btn btn-primary w-100">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>


            </div>

        </div>
        <!-- Order Details end -->
    </div>
</main>
<!-- Body main section ends -->

<?php include("footer.php"); ?>
<script>
$("#orderStatusForm").on("submit", function(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var submitButton = $(this).find('button[type=submit]');
    submitButton.prop('disabled', true).text('Saving...');

    $.ajax({
        method: "POST",
        url: "ajax/order_details.php",
        data: formData,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function(response) {
            Swal.fire({
                icon: response.status,
                title: response.status === 'success' ? 'Success!' : 'Error',
                text: response.message
            }).then(function() {
                if (response.status === 'success') {
                    window.location.reload();
                }
            });
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Update failed',
                text: 'Something went wrong!'
            });
        },
        complete: function() {
            submitButton.prop('disabled', false).text('Save');
        }
    });
});
</script>
