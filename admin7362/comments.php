<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Comments"; $page_title_url = "comments_"; ?>
<?php
if (isset($_GET['u'])){
	$blog_id = mysqli_real_escape_string($con,$_GET['u']);
	$stmt = $con -> prepare('SELECT heading FROM blog WHERE blog_id=?');
	$stmt -> bind_param('s',$blog_id);
	$stmt -> execute(); 
	$stmt -> store_result(); 
	$stmt -> bind_result($heading);
	$numrows = $stmt -> num_rows();
	if($numrows > 0){
	  while ($stmt -> fetch()) { }
	}
  $stmtt = $con -> prepare('SELECT * FROM blog_categories WHERE id=?');
	$stmtt -> bind_param('s',$category);
	$stmtt -> execute(); 
	$stmtt -> store_result(); 
	$stmtt -> bind_result($category_id_db,$category_name);
	while ($stmtt -> fetch()){}

  $stmt_bp = $con->prepare("SELECT COUNT(*) FROM comments WHERE blog_id = ?");
  $stmt_bp->bind_param('s',$blog_id);
  $stmt_bp->execute();
  $stmt_bp->bind_result($no_comments);
  $stmt_bp->fetch();
  $stmt_bp->close();
}
else{echo "<meta http-equiv=\"refresh\" content=\"0; url=adminhome.php\">";exit();}
?>
<title><?php echo $company_name; ?> - <?= $page_title ?> for <?= $heading ?></title>

<!-- Body main section starts -->
<main>
    <div class="container-fluid">
        
        <div class="row m-1">
            <div class="col-12">
                <h4 class="main-title"><?= $page_title ?> for <?= $heading ?> (<?= $no_comments ?>)</h4> 
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
$stmt_c = $con -> prepare('SELECT * FROM comments WHERE blog_id=? ORDER BY id DESC');
$stmt_c -> bind_param('s',$blog_id);
$stmt_c -> execute();
$stmt_c -> store_result();
$stmt_c -> bind_result($id,$blog_id,$name,$email,$comment,$display,$date_comment);
$numrows_c = $stmt_c -> num_rows();
if($numrows_c > 0){
  while ($stmt_c -> fetch()) {
    $date1 = new DateTime($date_comment);
    $date_comment_formatted = $date1->format('jS M, Y g:iA');
    $date_comment_formatted = strtolower($date_comment_formatted);
    ?>

<div class="mail-box">
      <?php if($display == "No"){ ?>
      <span class="ms-2 me-2">
        <i class="fa-solid fa-star text-warning star-icon fs-5"></i>
      </span>
      <?php } ?>
        <div class="flex-grow-1 position-relative"> 
          <?php if($display == "Yes"){ ?>
            <div class="mail-img h-35 w-35 b-r-50 overflow-hidden text-bg-primary position-absolute mt-1">
                <img alt="" class="img-fluid" src="assets/images/avtar/14.png"> 
            </div>
             <?php } ?>
            <div class="mg-s-45">
                <h6 class="mb-0 f-w-600"><?= $name ?> <?php if($display == "No"){echo"(Archived)";} ?></h6>
                <span class="f-s-13 text-<?php if($display == "No"){echo"secondary";}else{echo"primary";} ?>"><?= $comment ?></span>
            </div>
        </div>
    <div>
        <p class="text-center"></p>
        <span class="badge <?php if($display == "No"){echo"text-light-danger";}else{echo"text-light-success";} ?>"><?= $date_comment_formatted ?></span>
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
                <li class='archive-btn' data-id="<?= $id ?>"><a class="dropdown-item" href="#" style='color:forestgreen;'><i class="fa-solid fa-archive"></i> <?php if($display == "No"){echo"Unarchive";}else{echo"Archive";} ?> </a></li>

                <li class="delete-btn" data-id="<?= $id ?>"><a class="dropdown-item" href="#" style='color:crimson;'><i class="fa-solid fa-trash"></i> Delete </a></li>
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
$(document).on('click', '.archive-btn', function () {
  const id = $(this).data('id');
      $.ajax({
        method: "POST",
        url: "ajax/<?= $page_name ?>",
        data: {
          id: id,
          action: 'edit'
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
            'Could not work on the item.',
            'error'
          );
        }
      });
   
});


$(document).on('click', '.delete-btn', function () {
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

