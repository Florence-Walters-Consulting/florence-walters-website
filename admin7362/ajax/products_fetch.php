<?php include("../../api/config.php");
$page_name = "products.php"; $table_name = "products";
	$stmt = $con -> prepare("SELECT * FROM $table_name"); 
	$stmt -> execute(); 
	$stmt -> store_result(); 
	$stmt -> bind_result($id,$name,$slug,$sku,$category_id,$body,$price,$sale_price,$stock_quantity,$volume,$brand,$is_active,$is_featured,$picture1,$picture2,$picture3,$picture4,$picture5,$picture6,$keywords,$created_at,$updated_at); 
	$numrows = $stmt -> num_rows();
	if($numrows > 0){
		while ($stmt -> fetch()) { 
            //category name
            $stmt_cat = $con -> prepare('SELECT name FROM categories WHERE id = ?');
			$stmt_cat -> bind_param('i',$category_id);
			$stmt_cat -> execute(); 
			$stmt_cat -> store_result(); 
			$stmt_cat -> bind_result($category_name); 
			while ($stmt_cat -> fetch()){}
     
      ?>
<div class="col-md-6 col-lg-6 col-xxl-6">

    <div class="card blog-card overflow-hidden">
        <a class="glightbox img-hover-zoom" data-glightbox="type: image; zoomable: true;"
            href="../site_img/<?= $table_name ?>/<?= $picture1 ?>">
            <img alt="..." class="card-img-top" src="../site_img/<?= $table_name ?>/<?= $picture1 ?>" style='height:250px; object-fit:cover;'>
        </a>
        <div class="tag-container">
            <span class="badge text-light-secondary"><?= $category_name ?></span>
        </div>
        <div class="card-body">
            <h5><?= $name ?></h5>
            <hr>
            <p class="card-text text-secondary">
                <?= $currency ?><?= $price ?>
            </p>

            <p class="text-secondary f-s-12 mb-0"><?php if($is_featured == 1){ ?>Featured Product <?php } ?></p>
            <div class="app-divider-v dashed py-3"></div>
            <div class="d-flex justify-content-between align-items-center gap-2 position-relative">

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
                            <li class="delete-btn" data-id="<?= $id ?>" data-picture1="<?= $picture1 ?>" data-picture2="<?= $picture2 ?>" data-picture3="<?= $picture3 ?>" data-picture4="<?= $picture4 ?>" data-picture5="<?= $picture5 ?>" data-picture6="<?= $picture6 ?>">
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
                        <input class="form-control" id='name' placeholder="Name" name='name' type="text" value="<?= $name ?>" required>
                        <label for="name">Name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <select class="form-control" name="category_id" required>
                            <option selected value="<?= $category_id ?>"><?= $category_name ?></option>
                            <?php
                            $query = "SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC";
                            $result = mysqli_query($con, $query);
                            while ($row = mysqli_fetch_assoc($result)) {
                                echo "<option value='{$row['id']}'>{$row['name']}</option>";
                            }
                        ?>
                        </select>
                        <label class="form-floating form-label">Category</label>
                    </div>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="text" name="brand" placeholder="Brand" value="<?= $brand ?>">
                        <label class="form-label">Brand</label>
                    </div>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="text" name="volume" placeholder="Volume" value="<?= $volume ?>">
                        <label class="form-label">Size</label>
                    </div>
                    <div class="form-floating mb-3">
                        <label>Body</label>
                        <textarea name='body' id='body' class="form-control summernote" placeholder="Body" required><?= $body ?></textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="floating-form mb-3">
                                <input
                                    class="form-control" type="number" name="price" min="0" step="0.01" value="<?= $price ?>" required>
                                <label class="form-label">Price</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="floating-form mb-3">
                                <input class="form-control" type="number" name="sale_price" min="0" step="0.01" value="<?= (float)$sale_price > 0 ? $sale_price : '' ?>">
                                <label class="form-label">Sale Price</label>
                            </div>
                        </div>
                    </div>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="number" name="stock_quantity" min="0" value="<?= $stock_quantity ?>" required>
                        <label class="form-label">Stock Quantity</label>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <select class="form-control" name="is_featured">
                                    <option value="0" <?= $is_featured == 0 ? 'selected' : '' ?>>No</option>
                                    <option value="1" <?= $is_featured == 1 ? 'selected' : '' ?>>Yes</option>
                                </select>
                                <label class="form-floating form-label">Featured Product</label>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <select class="form-control" name="is_active">
                                    <option value="1" <?= $is_active == 1 ? 'selected' : '' ?>>Yes</option>
                                    <option value="0" <?= $is_active == 0 ? 'selected' : '' ?>>No</option>
                                </select>
                                <label class="form-floating form-label">Active</label>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Main Image</label> <br>
                        <img src="../site_img/products/<?= $picture1 ?>" style="wdth:100%; height:100px;" alt="<?= $name ?>">
                        <input class="form-control" type="file" name='fileField' accept="image/*">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Image 2</label> <br>
                        <?php if($picture2 !== ""){ ?>
                        <img src="../site_img/products/<?= $picture2 ?>" style="wdth:100%; height:100px;" alt="<?= $name ?>">
                        <?php } ?>
                        <input class="form-control" type="file" name='fileField2' accept="image/*">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Image 3</label> <br>
                        <?php if($picture3 !== ""){ ?>
                        <img src="../site_img/products/<?= $picture3 ?>" style="wdth:100%; height:100px;" alt="<?= $name ?>">
                        <?php } ?>
                        <input class="form-control" type="file" name='fileField3' accept="image/*">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Image 4</label> <br>
                        <?php if($picture4 !== ""){ ?>
                        <img src="../site_img/products/<?= $picture4 ?>" style="wdth:100%; height:100px;" alt="<?= $name ?>">
                        <?php } ?>
                        <input class="form-control" type="file" name='fileField4' accept="image/*">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Image 5</label> <br>
                        <?php if($picture5 !== ""){ ?>
                        <img src="../site_img/products/<?= $picture5 ?>" style="wdth:100%; height:100px;" alt="<?= $name ?>">
                        <?php } ?>
                        <input class="form-control" type="file" name='fileField5' accept="image/*">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Image 6</label> <br>
                        <?php if($picture6 !== ""){ ?>
                        <img src="../site_img/products/<?= $picture6 ?>" style="wdth:100%; height:100px;" alt="<?= $name ?>">
                        <?php } ?>
                        <input class="form-control" type="file" name='fileField6' accept="image/*">
                    </div>
                    <input type="hidden" name="id" value="<?= $id ?>">
                    <input type="hidden" name="picture1" value="<?= $picture1 ?>">
                    <input type="hidden" name="picture2" value="<?= $picture2 ?>">
                    <input type="hidden" name="picture3" value="<?= $picture3 ?>">
                    <input type="hidden" name="picture4" value="<?= $picture4 ?>">
                    <input type="hidden" name="picture5" value="<?= $picture5 ?>">
                    <input type="hidden" name="picture6" value="<?= $picture6 ?>">
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
    const picture1 = $li.data("picture1");
    const picture2 = $li.data("picture2");
    const picture3 = $li.data("picture3");
    const picture4 = $li.data("picture4");
    const picture5 = $li.data("picture5");
    const picture6 = $li.data("picture6");


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
                            picture1,
                            picture2,
                            picture3,
                            picture4,
                            picture5,
                            picture6,
                            action: "delete"
                        },
                        dataType: "json",
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
    const picture1 = $(this).data("picture1");
    const picture2 = $(this).data('picture2');
    const picture3 = $(this).data('picture3');
    const picture4 = $(this).data('picture4');
    const picture5 = $(this).data('picture5');
    const picture6 = $(this).data('picture6');
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
                    picture1,
                    picture2,
                    picture3,
                    picture4,
                    picture5,
                    picture6
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
