<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Emails"; $page_title_url = "emails_"; ?>
<title><?php echo $company_name; ?> - <?= $page_title ?></title>
<?php 
$stmt_bp = $con->prepare("SELECT COUNT(*) FROM email_subscribers");
$stmt_bp->execute();
$stmt_bp->bind_result($no_emails);
$stmt_bp->fetch();
$stmt_bp->close();
?>
<!-- Body main section starts -->
<main>
    <div class="container-fluid">

        <div class="row m-1">
            <div class="col-12">
                <h4 class="main-title"><?= $page_title ?> (<?= $no_emails ?>)</h4>
            </div>
        </div>
        <div class="row position-relative">
            <div class="col-lg-9">
                <div class="card">
                    <div class="card-body">
                        <div class="content-wrapper mt-3">
                            <div class="tabs-content active" id="tab-1">
                                <div class="mail-table">
                                    <?php
$stmt_c = $con -> prepare('SELECT id,email FROM email_subscribers ORDER BY id DESC');
$stmt_c -> execute();
$stmt_c -> store_result();
$stmt_c -> bind_result($id,$email);
$numrows_c = $stmt_c -> num_rows();
if($numrows_c > 0){
  while ($stmt_c -> fetch()) {
    ?>

                                    <div class="mail-box">

                                        <div class="flex-grow-1 position-relative">

                                            <div class="mg-s-45">
                                                <span class="f-s-13 text-primary"><?= $email ?></span>
                                            </div>
                                        </div>
                                        <div>

                                        </div>
                                        <div>
                                            <div class="btn-group dropdown-icon-none">
                                                <button aria-expanded="false"
                                                    class="btn border-0 icon-btn b-r-4 dropdown-toggle"
                                                    data-bs-auto-close="true" data-bs-toggle="dropdown"
                                                    type="button">
                                                    <i class="fa-solid fa-gear"></i>
                                                </button>
                                                <ul class="dropdown-menu">

                                                    <li class="delete-btn" data-id="<?= $id ?>"><a class="dropdown-item" style='color:crimson;'><i class="fa-solid fa-trash"></i> Delete </a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <?php } } ?>


                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</main>
<?php include("footer.php"); ?>


<script>
$(document).on('click', '.archive-btn', function() {
    const id = $(this).data('id');
    $.ajax({
        method: "POST",
        url: "ajax/<?= $page_name ?>",
        data: {
            id: id,
            action: 'edit'
        },
        dataType: "json",
        success: function(response) {
            Swal.fire(
                'Done!',
                response,
                'success'
            ).then(() => {
                location.reload();
            });
        },
        error: function() {
            Swal.fire(
                'Failed!',
                'Could not work on the item.',
                'error'
            );
        }
    });

});


$(document).on('click', '.delete-btn', function() {
    const id = $(this).data('id');

    Swal.fire({
        title: 'Are you sure?',
        text: "This item will be permanently deleted",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method: "POST",
                url: "ajax/<?= $page_name ?>",
                data: {
                    id: id,
                    action: 'delete'
                },
                dataType: "json",
                success: function(response) {
                    Swal.fire(
                        'Done!',
                        response,
                        'success'
                    ).then(() => {
                        location.reload();
                    });
                },
                error: function() {
                    Swal.fire(
                        'Failed!',
                        'Could not delete the item.',
                        'error'
                    );
                }
            });
        }
    });
});
</script>