<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Delivery Zones"; $page_title_url = "delivery_zones_"; ?>
<title><?php echo $company_name; ?> - <?= $page_title ?></title>
<!-- Body main section starts -->
<main>
    <div class="container-fluid">

        <div class="row m-1">
            <div class="col-12">
                <h4 class="main-title"><?= $page_title ?></h4>
            </div>
        </div>

        <div class="row">
            <div class='col-8'>
                <form id='theForm' class="app-form rounded-control" enctype='multipart/form-data'>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="text" name="location" placeholder="Location" required>
                        <label class="form-label">Location</label>
                    </div>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="text" name="fee" placeholder="Make sure it is to 2 decimal places e.g 3.00" required>
                        <label class="form-label">Fee (write to 2 decimal places e.g 3.00)</label>
                    </div>
                    <div>
                        <button type="submit" name="action" value="save" class="btn btn-light-primary">Save</button>
                    </div>
                </form>
            </div>

        </div>
        <hr>
        <div class="row mt-4 mb-4">
            <div class="col-12">
                <h4 class="main-title">Uploaded Items</h4>
            </div>
        </div>
        <div id="data" class='row blog-section'></div>

    </div>
</main>
<?php include("footer.php"); ?>
<script>
function loadData() {
    $("#data").load("ajax/<?= $page_title_url ?>fetch.php");
}
$(document).ready(function() {
    loadData();
});
</script>

<script>
// Detect the clicked button
$(document).on("click", "#theForm button[type=submit]", function() {
    // Remove "clicked" from all buttons first
    $("#theForm button[type=submit]").removeAttr("clicked");
    $(this).attr("clicked", "true");
});

$("#theForm").on("submit", function(e) {
    e.preventDefault();

    var formData = new FormData(this);
    // Get the submit button that was clicked
    var actionType = $("#theForm button[type=submit][clicked=true]").val();
    formData.append('action', actionType);

    $.ajax({
        method: "POST",
        url: "ajax/<?= $page_name ?>",
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response
            });
            $("#theForm")[0].reset();
            loadData();
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Upload failed',
                text: 'Something went wrong!'
            });
        }
    });
});
</script>