<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Change Your Password"; $page_title_url = "password_"; ?>
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
            <!-- Password Form with Toggle -->
<form id='theForm' class="app-form rounded-control" enctype='multipart/form-data'>
    <div class="floating-form mb-3 position-relative">
        <input class="form-control password-field" type="password" name="old_password" placeholder="Old Password" required>
        <label class="form-label">Old Password</label>
        <button type="button" class="toggle-password btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2">
            <i class='fa-solid fa-eye-slash'></i>
        </button>
    </div>

    <div class="floating-form mb-3 position-relative">
        <input class="form-control password-field" type="password" name="new_password" placeholder="New Password" required>
        <label class="form-label">New Password</label>
        <button type="button" class="toggle-password btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2">
          <i class='fa-solid fa-eye-slash'></i>
        </button>
    </div>

    <input type="hidden" name="manager" value='<?= $manager ?>'>

    <div>
        <button type="submit" name="action" value="edit" class="btn btn-light-primary">Save</button>
    </div>   
</form>

            </div>

        </div>
        <hr>
       

    </div>
</main>
<?php include("footer.php"); ?>

<script>
  // Password toggle visibility
  $(document).on("click", ".toggle-password", function () {
    const input = $(this).siblings("input");
    const type = input.attr("type") === "password" ? "text" : "password";
    input.attr("type", type);
    $(this).html(type === "password" ? "<i class='fa-solid fa-eye-slash'></i>" : "<i class='fa-solid fa-eye'></i>");
  });

  // Detect the clicked button
  $(document).on("click", "#theForm button[type=submit]", function () {
    $("#theForm button[type=submit]").removeAttr("clicked");
    $(this).attr("clicked", "true");
  });

  // Submit handler with response check
  $("#theForm").on("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var actionType = $("#theForm button[type=submit][clicked=true]").val();
    formData.append('action', actionType);

    $.ajax({
      method: "POST",
      url: "ajax/<?= $page_name ?>",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        let res;
        try {
          res = typeof response === "string" ? JSON.parse(response) : response;
        } catch (e) {
          res = { status: "error", message: response };
        }

        Swal.fire({
          icon: res.status === "success" ? "success" : "error",
          title: res.status === "success" ? "Success!" : "Error",
          text: res.message
        });

        if (res.status === "success") {
          $("#theForm")[0].reset();
        }
      },
      error: function () {
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text: 'Something went wrong!'
        });
      }
    });
  });
</script>


