<?php 
session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); 
$page_title = "Orders"; 
$page_title_url = "orders_"; 
?>
<title><?php echo $company_name; ?> - <?= $page_title ?></title>

<main>
    <div class="container-fluid">
        <div class="row m-1">
            <div class="col-12">
                <h4 class="main-title"><?= $page_title ?></h4>
            </div>
        </div>

        <form id="filterForm" class="row g-3 mb-4">
            <div class="col-md-3">
                <label class="form-label">Order Status</label>
                <select name="status" class="form-control">
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>
            <div class="col-md-3">
                <label class="form-label">From Date</label>
                <input type="date" name="from_date" class="form-control">
            </div>
            <div class="col-md-3">
                <label class="form-label">To Date</label>
                <input type="date" name="to_date" class="form-control">
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">Filter</button>
            </div>
        </form>

        <div id="ordersTable" class='card-body'>
            <div class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p>Loading orders...</p>
            </div>
        </div>
    </div>
</main>

<script src="assets/js/jquery-3.6.3.min.js"></script>
<script>
$(document).ready(function() {

    // Load orders on page load
    loadOrders();

    // Handle filter form submit
    $('#filterForm').on('submit', function(e) {
        e.preventDefault();
        loadOrders();
    });

    // Handle pagination clicks (delegated)
    $(document).on('click', '.pagination a', function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        const params = href.split('?')[1];
        loadOrders(params);
    });

    // AJAX loader function
    function loadOrders(params = '') {
        const formData = $('#filterForm').serialize();
        $('#ordersTable').html(`
      <div class="text-center p-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Loading...</p>
      </div>
    `);
        $.ajax({
            url: 'ajax/orders_fetch.php' + (params ? '?' + params : ''),
            type: 'GET',
            data: formData,
            success: function(data) {
                $('#ordersTable').html(data);
            },
            error: function() {
                $('#ordersTable').html("<p class='text-danger text-center'>Error loading orders.</p>");
            }
        });
    }

});
</script>

<?php include("footer.php"); ?>