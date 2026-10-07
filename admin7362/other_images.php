<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Other Images"; $page_title_url = "other_images_"; ?>
<title><?php echo $company_name; ?> - <?= $page_title ?></title>
<!-- Body main section starts -->
<main>
    <div class="container-fluid">

        <div class="row m-1">
            <div class="col-12">
                <h4 class="main-title"><?= $page_title ?></h4>
            </div>
        </div>
        <div class="row mt-4 mb-4">

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
