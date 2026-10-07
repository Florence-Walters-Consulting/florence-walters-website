<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Testimonials"; $page_title_url = "testimonials_"; ?>
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
                    <input class="form-control" type="text" name="name" placeholder="Name" required>
                    <label class="form-label">Name</label>
                </div>
                <div class="floating-form mb-3">
                    <input class="form-control" type="text" name="occupation" placeholder="Occupation" required>
                    <label class="form-label">Occupation</label>
                </div>
                <div class="mb-3">
                    <label for="body">Comment</label>
                    <textarea class="form-control summernote" name="body" style='height:200px;' placeholder="Body" required></textarea>
                </div>
                <div class="form-floating mb-3">
                    <input class="form-control" type="file" name='fileField' accept="image/*">
                    <label class="form-floating form-label">Image (Optional)</label>
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
<link href="assets/vendor/summernote/summernote-bs5.min.css" rel="stylesheet">
<script src="assets/vendor/summernote/summernote-bs5.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/perevoshchikov/summernote-grid@1.0.0/summernote-grid.min.js"></script>
<script>
    const pageTitleUrl = "<?= $page_title_url ?>";
    const pageName = "<?= $page_name ?>";
</script>
<script src="script.js"></script>
