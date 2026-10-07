<?php include("../../api/config.php");
$page_name = "menu.php"; $table_name = "menu";
	$stmt = $con -> prepare("SELECT * FROM $table_name"); 
	$stmt -> execute(); 
	$stmt -> store_result(); 
	$stmt -> bind_result($id,$menu_id,$category,$heading,$slug,$preamble,$body,$price,$picture,$picture2,$picture3,$featured); 
	$numrows = $stmt -> num_rows();
	if($numrows > 0){
		while ($stmt -> fetch()) { 
      //category name
      $stmt_cat = $con -> prepare('SELECT * FROM menu_categories WHERE id = ?');
			$stmt_cat -> bind_param('i',$category);
			$stmt_cat -> execute(); 
			$stmt_cat -> store_result(); 
			$stmt_cat -> bind_result($cat_idd,$category_name,$ssl,$sssss); 
			while ($stmt_cat -> fetch()){}
      ?>
<div class="col-md-6 col-lg-6 col-xxl-6">

    <div class="card blog-card overflow-hidden">
        <img alt="..." class="card-img-top" src="assets/images/team/1.jpg">
        <div class="tag-container">
            <span class="badge text-light-secondary"><?= $category_name ?></span>
        </div>
        <div class="card-body">
            <h5><?= $heading ?></h5>
            <hr>


            <p class="text-secondary f-s-12 mb-0"><?php if($featured == "Yes"){ ?>Featured Item <?php } ?></p>
            <div class="app-divider-v dashed py-3"></div>
            <div class="d-flex justify-content-between align-items-center gap-2 position-relative">
                <div class="">
                    <h6 class="mb-0">Price: <?= $currency ?><?= number_format($price) ?></h6>

                </div>

                <div>
                    <div class="btn-group dropdown-icon-none">
                        <button aria-expanded="false"
                            class="btn btn-primary dropdown-toggle"
                            data-bs-auto-close="true"
                            data-bs-toggle="dropdown" type="button">
                            Edit
                        </button>
                        <ul class="dropdown-menu">
                            <li data-bs-target="#Modal<?= $id ?>" data-bs-toggle="modal">
                                <a class="dropdown-item text-success" href="javascript:void(0)">
                                    <i class="fa fa-wrench"></i> Edit
                                </a>
                            </li>
                            <li class="delete-btn" data-id="<?= $id ?>" data-picture="<?= $picture ?>" data-picture2="<?= $picture2 ?>" data-picture3="<?= $picture3 ?>">
                                <a class="dropdown-item text-danger" href="javascript:void(0)">
                                    <i class="fa fa-trash"></i> Delete
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div aria-hidden="true" aria-labelledby="Modal<?= $id ?>Label" class="modal fade" id="Modal<?= $id ?>"
    tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="Modal<?= $id ?>Label">Edit Item</h1>
                <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
            </div>
            <div class="modal-body">
                <form id="form<?= $id ?>" class="app-form ajax-form" enctype="multipart/form-data">


                    <div class="form-floating mb-3">
                        <input class="form-control" id='heading' placeholder="Heading" name='heading' type="text" value="<?= $heading ?>" required>
                        <label for="heading">Heading</label>
                    </div>
                    <div class="form-floating mb-3">
                        <select class="form-control" name="category">
                            <option selected value="<?= $category ?>"><?= $category_name ?></option>
                            <?php
                            $query = "SELECT * FROM menu_categories ORDER BY category_name ASC";
                            $result = mysqli_query($con, $query);
                            while ($row = mysqli_fetch_assoc($result)) {
                                echo "<option value='{$row['id']}'>{$row['category_name']}</option>";
                            }
                        ?>
                        </select>
                        <label class="form-floating form-label">Menu Categories</label>
                    </div>
                    <!--<div class="form-floating mb-3">
                        <input class="form-control" id='preamble' placeholder="Preamble" name='preamble' type="text" value="<?= $preamble ?>" required>
                        <label for="preamble">Preamble</label>
                    </div>-->
                    <div class="form-floating mb-3">
                        <label>Body (Optional)</label>
                        <textarea name='body' id='body' class="form-control summernote" placeholder="Body"><?= $body ?></textarea>
                    </div>
                    <div class="form-floating mb-3">
                        <input class="form-control" id='price' placeholder="Price" name='price' type="text" value="<?= $price ?>" required>
                        <label for="price">Price</label>
                    </div>
                    <!--<div class="form-floating mb-3">
                        <select class="form-control" name="featured">
                            <option selected value="<?= $featured ?>"><?= $featured ?></option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label class="form-floating form-label">Set as Featured Item</label>
                    </div>
                   

                    <div class="mb-3">
                        <label class="form-label">File</label> <br>
                        <img src="../site_img/menu/<?= $picture ?>" style="wdth:100%; height:100px;" alt="<?= $heading ?>">
                        <input class="form-control" type="file" name='fileField' accept="image/*">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">File 2</label> <br>
                        <?php if($picture2){ ?>
                        <img src="../site_img/menu/<?= $picture2 ?>" style="wdth:100%; height:100px;" alt="<?= $heading ?>">
                        <?php } ?>
                        <input class="form-control" type="file" name='fileField2' accept="image/*">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">File 3</label> <br>
                        <?php if($picture3 !== ""){ ?>
                        <img src="../site_img/menu/<?= $picture3 ?>" style="wdth:100%; height:100px;" alt="<?= $heading ?>">
                        <?php } ?>
                        <input class="form-control" type="file" name='fileField3' accept="image/*">
                    </div>-->

                    <input type="hidden" name="id" value="<?= $id ?>">
                    <input type="hidden" name="picture" value="<?= $picture ?>">
                    <input type="hidden" name="picture2" value="<?= $picture2 ?>">
                    <input type="hidden" name="picture3" value="<?= $picture3 ?>">
                    <input type="hidden" name="action" value="edit">
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Close</button>
                <button form="form<?= $id ?>" class="btn btn-primary submit-btn" type="submit" name="action" value="edit">Save changes</button>
            </div>
        </div>
    </div>
</div>

<?php } } ?>
<script>
$(document).on("click", "button[type=submit]", function() {
    $("button[type=submit]").removeAttr("clicked");
    $(this).attr("clicked", "true");
});
</script>

<!-- === EDIT FORM === -->
<script>
$(document).off("submit", ".ajax-form").on("submit", ".ajax-form", function(e) {
    e.preventDefault();

    const $form = $(this);
    const $btn = $(`button[form='${$form.attr("id")}']`);
    const $btnText = $btn.find(".btn-text");
    const $spinner = $btn.find(".spinner-border");

    const formData = new FormData(this);

    // Button loading
    $btn.prop("disabled", true);
    $btnText.text("Saving...");
    $spinner.removeClass("d-none");

    // SweetAlert loader
    Swal.fire({
        icon: "info",
        title: "Saving changes...",
        text: "Please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    $.ajax({
        method: "POST",
        url: "ajax/<?= $page_name ?>",
        data: formData,
        contentType: false,
        processData: false,

         success: function(response) {

            var res = typeof response === 'string' ? JSON.parse(response) : response;

            if (res.status === 'success') {
                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: res.message
                });

                const modalEl = $form.closest(".modal")[0];
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                $form[0].reset();

                if (typeof loadData === "function") {
                    setTimeout(loadData, 150);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: res.message,
                });
            }
        },

        error: function() {
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Something went wrong!"
            });
        },

        complete: function() {
            $btn.prop("disabled", false);
            $btnText.text("Save changes");
            $spinner.addClass("d-none");
        }
    });
});
</script>

<!-- === DELETE ITEM === -->
<script>
$(document).on("click", ".delete-btn a", function(e) {
    e.preventDefault();

    const $li = $(this).closest(".delete-btn");
    const id = $li.data("id");
    const picture = $li.data("picture");
    const picture2 = $li.data("picture2");
    const picture3 = $li.data("picture3");

    Swal.fire({
        title: "Are you sure?",
        text: "This item will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it",
        showLoaderOnConfirm: true, // this keeps the spinner active while waiting
        allowOutsideClick: () => !Swal.isLoading(), // prevent accidental close
        preConfirm: () => {
            // return a promise so Swal waits for AJAX before closing
            return new Promise((resolve, reject) => {
                    $.ajax({
                        method: "POST",
                        url: "ajax/<?= $page_name ?>",
                        data: {
                            id,
                            picture,
                            picture2,
                            picture3,
                            action: "delete"
                        },
                        success: function(response) {
                            resolve(response);
                        },
                        error: function() {
                            reject("Could not delete the item.");
                        },
                    });
                })
                .then((response) => {
                    Swal.fire({
                        icon: response.status,
                        title: response.status === 'success' ?
                            'Deleted!' : 'Error',
                        text: response.message
                    });

                    if (response.status === 'success') {
                        if (typeof loadData === "function") {
                            setTimeout(loadData, 150);
                        }
                    }
                })
                .catch((err) => {
                    Swal.fire("Failed!", err, "error");
                });
        },
    });
});
</script>

<!-- === DELETE IMAGE === -->
<script>
$(document).on("click", ".delete-image-btn", function() {
    const id = $(this).data("id");
    const picture = $(this).data("picture");
    const picture2 = $(this).data("picture2");
    const picture3 = $(this).data("picture3");
    const btn = $(this);

    Swal.fire({
        title: "Are you sure?",
        text: "This will permanently delete the image.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            // show bootstrap spinner in button
            btn.html('<span class="spinner-border spinner-border-sm"></span> Deleting...').prop("disabled", true);

            $.ajax({
                url: "ajax/delete_image.php",
                method: "POST",
                data: {
                    id,
                    picture,
                    picture2,
                    picture3
                },
                 success: function(response) {
                    var res = typeof response === 'string' ? JSON.parse(response) : response;
                    if (res.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: res.message
                        }).then(() => {
                            // Close any open Bootstrap modal cleanly
                            $('.modal').modal('hide');

                            // Remove leftover modal backdrop
                            $('.modal-backdrop').remove();

                            // Reload your UI
                            loadData();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: res.message
                        });
                    }
                },
                error: function() {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Image could not be deleted.'
                    });
                },
                complete: function() {
                    btn.html('<i class="bi bi-trash"></i> Delete').prop("disabled", false);
                }
            });

        }
    });
});
</script>