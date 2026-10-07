<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Applications"; $page_title_url = "applications_"; ?>
<title><?php echo $company_name; ?> - <?= $page_title ?></title>
<?php 
$stmt_bp = $con->prepare("SELECT COUNT(*) FROM applications");
$stmt_bp->execute();
$stmt_bp->bind_result($no_applications);
$stmt_bp->fetch();
$stmt_bp->close();
?>
<!-- Body main section starts -->
<main>
    <div class="container-fluid">
        
        <div class="row m-1">
            <div class="col-12">
                <h4 class="main-title"><?= $page_title ?> (<?= $no_applications ?>)</h4> 
            </div>
        </div>
        <div class="row position-relative">                    
<div class="col-lg-9">
  <div class="card mb-4">
  <div class="card-body">
    <form id="filterForm">
      <label for="position" class="form-label me-2">Filter by Position:</label>
      <select class="form-control w-auto d-inline-block" name="position" id="position">
        <option value="">All Positions</option>
        <option value="Operations Manager">Operations Manager</option>
        <option value="Human Resources Manager">Human Resources Manager</option>
        <option value="Floor Manager">Floor Manager</option>
        <option value="Accountant">Accountant</option>
        <option value="Bar Supervisor">Bar Supervisor</option>
        <option value="Floor Supervisor">Floor Supervisor</option>
        <option value="Chefs">Chefs</option>
        <option value="Store Keeper">Store Keeper</option>
        <option value="Cashier">Cashier</option>
        <option value="Customer Service Representative">Customer Service Representative</option>
        <option value="Hostess">Hostess</option>
        <option value="Mixologist/Bartender">Mixologist/Bartender</option>
        <option value="Bottle Girl">Bottle Girl</option>
        <option value="Concierge">Concierge</option>
        <option value="Waiter">Waiter</option>
        <option value="Waitress">Waitress</option>
        <option value="Runner">Runner</option>
        <option value="Bar Back">Bar Back</option>
        <option value="Cleaner">Cleaner</option>
      </select>
      <button type="submit" class="btn btn-primary" style='position:relative; top:-2px;'>Filter</button>
    </form>
  </div>
</div>

    <div class="card">
        <div class="card-body">
            <div class="content-wrapper mt-3">
              <div id="resultsCount" class="mb-2 text-muted small"></div>
                <div class="tabs-content active" id="tab-1">
                    <div class="mail-table">
<div id="applicationsList">
<?php
$stmt_c = $con -> prepare('SELECT id, full_name, email, position, cv, date FROM applications ORDER BY id DESC');
$stmt_c -> execute();
$stmt_c -> store_result();
$stmt_c -> bind_result($id, $full_name, $email, $position, $cv, $date);
$numrows_c = $stmt_c -> num_rows();
if($numrows_c > 0){
  while ($stmt_c -> fetch()) {
    $date1 = date_create($date);
    $date_formatted = date_format($date1, "jS F, Y - g:i a");
  ?>

<div class="mail-box">
      
        <div class="flex-grow-1 position-relative"> 
          
            <div class="mg-s-45">
                <span class="f-s-13 text-primary"><?= $full_name ?></span> <br>
                <span class="f-s-13 text-primary"><?= $email ?></span> <br>
                <span class="f-s-13 text-primary"><?= $position ?></span> <br>
                <span class="f-s-13 text-secondary"><?= $date_formatted ?></span> <br>
                <a download href='../apply/cvs/<?= $cv ?>' class="f-s-13 text-primary">Download CV</a>
            </div>
        </div>
    
    <div>
        <div class="btn-grou dropdown-icon-none">
            <button aria-expanded="false"
                    class="btn border-0 icon-btn b-r-4 dropdown-toggle"
                    data-bs-auto-close="true" data-bs-toggle="dropdown"
                    type="button">
                <i class="fa-solid fa-gear"></i>
            </button>
            <ul class="dropdown-menu">

                <li class="delete-btn" data-cv='<?= $cv ?>' data-id="<?= $id ?>"><a class="dropdown-item" style='color:crimson;'><i class="fa-solid fa-trash"></i> Delete </a></li>
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

    </div>
</main>
<?php include("footer.php"); ?>
<script src="assets/js/jquery-3.6.3.min.js"></script>

<script>


$(document).on('click', '.delete-btn', function () {
  const id = $(this).data('id');
  const cv = $(this).data('cv');
  console.log(cv)
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
          cv: cv,
          action: 'delete'
        },
        success: function (response) {
          Swal.fire(
            'Done!',
            response,
            'success'
          ).then(() => {
            location.reload();
          });
        },
        error: function () {
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

<script>
  $('#filterForm').on('submit', function (e) {
  e.preventDefault();

  const position = $('#position').val();

  $.ajax({
    method: 'POST',
    url: 'ajax/fetch_applications.php',
    dataType: 'json',
    data: { position: position },
    success: function (response) {
      $('#applicationsList').html(response.html);
      $('#resultsCount').text(`Showing ${response.count} result${response.count !== 1 ? 's' : ''}`);
    },
    error: function () {
      $('#applicationsList').html("<p class='text-danger'>Error loading applications.</p>");
      $('#resultsCount').text('');
    }
  });
});

</script>


