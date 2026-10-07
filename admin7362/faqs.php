<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "FAQs"; $page_title_url = "faqs_"; ?>
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
                    <input class="form-control" type="text" name="question" placeholder="Question" required>
                    <label class="form-label">Question</label>
                </div>
                <div class="mb-3">
                    <label for="body">Answer</label>
                    <textarea class="form-control summernote" name="body" style='height:200px;' placeholder="Answer" required></textarea>
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
        <div class='row faq-accordion'>
            <div class="col-lg-8 offset-lg-2 mb-3">
                <div id="data" class="accordion app-accordion accordion-primary"></div>
            </div>
        </div>

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
