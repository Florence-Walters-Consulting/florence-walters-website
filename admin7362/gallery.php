<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Gallery"; $page_title_url = "gallery_"; ?>
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
                        <input class="form-control" type="text" name="heading" placeholder="Heading" required>
                        <label class="form-label">Heading</label>
                    </div>
                    <div class="form-floating mb-3">
                        <textarea class="form-control" id='paragraph' name="paragraph" style='height:100px;' placeholder="Paragraph" required></textarea>
                        <label for='paragraph' class="form-floating form-label">Paragraph</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input class="form-control" type="file" name='fileField' accept="image/*" required>
                        <label class="form-floating form-label">Image</label>
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
const pageTitleUrl = "<?= $page_title_url ?>";
const pageName = "<?= $page_name ?>";
</script>
<script src="script.js"></script>
