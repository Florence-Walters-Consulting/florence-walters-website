<?php 
session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); 
$page_title = "Users"; 
$page_title_url = "users_"; 
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
                <label class="form-label">Search</label>
                <input name="search" type='text' class="form-control">
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <button type="submit" class="btn btn-primary w-100">Search</button>
            </div>
        </form>

        <div id="usersTable" class='card-body'>
            <div class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p>Loading users...</p>
            </div>
        </div>
    </div>
</main>

<script src="assets/js/jquery-3.6.3.min.js"></script>
<script>
$(document).ready(function() {

    // Load orders on page load
    loadUsers();

    // Handle filter form submit
    $('#filterForm').on('submit', function(e) {
        e.preventDefault();
        loadUsers();
    });

    // Handle pagination clicks (delegated)
    $(document).on('click', '.pagination a', function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        const params = href.split('?')[1];
        loadUsers(params);
    });

    // AJAX loader function
    function loadUsers(params = '') {
        const formData = $('#filterForm').serialize();
        $('#usersTable').html(`
      <div class="text-center p-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Loading...</p>
      </div>
    `);
        $.ajax({
            url: 'ajax/users_fetch.php' + (params ? '?' + params : ''),
            type: 'GET',
            data: formData,
            success: function(data) {
                $('#usersTable').html(data);
            },
            error: function() {
                $('#usersTable').html("<p class='text-danger text-center'>Error loading users.</p>");
            }
        });
    }

});
</script>

<?php include("footer.php"); ?>