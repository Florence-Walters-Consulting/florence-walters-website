<?php include("../../api/config.php");
$page_name = "faqs.php"; $table_name = "faqs";
	$stmt = $con -> prepare("SELECT * FROM $table_name"); 
	$stmt -> execute(); 
	$stmt -> store_result(); 
	$stmt -> bind_result($id,$question,$body); 
	$numrows = $stmt -> num_rows();
	if($numrows > 0){
		while ($stmt -> fetch()) { ?>
<div class="accordion-item">
    <h2 class="accordion-header">
        <button aria-controls="collapse<?= $id ?>" aria-expanded="true"
            class="accordion-button"
            data-bs-target="#collapse<?= $id ?>" data-bs-toggle="collapse"
            type="button">
            <i class="fa-solid fa-question pe-2"></i> <?= $question ?> <i class="fa-solid fa-chevron-down icon-chevron"></i>
        </button>
    </h2>
    <div class="accordion-collapse collapse" data-bs-parent="#accordionExample"
        id="collapse<?= $id ?>">
        <div class="accordion-body"><?= $body ?></div>
        <div style='padding:10px;'>
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
                    <li class="delete-btn" data-id="<?= $id ?>">
                        <a class="dropdown-item text-danger" href="javascript:void(0)">
                            <i class="fa fa-trash"></i> Delete
                        </a>
                    </li>
                </ul>
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
                        <input class="form-control" id='question' placeholder="Question" name='question' type="text" value="<?= $question ?>" required>
                        <label for="question">Question</label>
                    </div>
                    <div class="form-floating mb-3">
                        <label>Answer</label>
                        <textarea name='body' id='body' class="form-control summernote" placeholder="Answer" required><?= $body ?></textarea>
                    </div>

                    <input type="hidden" name="id" value="<?= $id ?>">
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
    const picture = $(this).data("picture");
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
                    picture
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