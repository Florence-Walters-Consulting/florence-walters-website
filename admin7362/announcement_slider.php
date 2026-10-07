<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Announcement Slider"; $page_title_url = "announcement_slider_"; ?>
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
                        <input class="form-control" type="text" name="text" placeholder="Text" required>
                        <label class="form-label">Text</label>
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
