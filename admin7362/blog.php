<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<?php $page_title = "Blog"; $page_title_url = "blog_"; ?>
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
                    <select class="form-control" name="category">
                        <option value="">Select Category</option>
                        <?php
                            $query = "SELECT * FROM blog_categories ORDER BY category_name ASC";
                            $result = mysqli_query($con, $query);
                            while ($row = mysqli_fetch_assoc($result)) {
                                echo "<option value='{$row['id']}'>{$row['category_name']}</option>";
                            }
                        ?>
                    </select>
                    <label class="form-floating form-label">Blog Categories</label>
                </div>
                <div class="floating-form mb-3">
                    <input class="form-control" type="text" name="preamble" placeholder="Preamble" required>
                    <label class="form-label">Preamble</label>
                </div>
                <div class="mb-3">
                    <label for="body">Body</label>
                    <textarea class="form-control summernote" name="body" style='height:200px;' placeholder="Body" required></textarea>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-control" name="featured">
                        <option value="">Please choose one</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <label class="form-floating form-label">Set as Featured Post</label>
                </div>
                <div class="form-floating mb-3">
                    <select class="form-control" name="comments_allowed">
                        <option value="">Please choose one</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                    <label class="form-floating form-label">Comments Allowed</label>
                </div>
               <!-- date -->
               <?php
$today = date('Y-m-d');
$formattedToday = date('F j, Y'); 
?>

<div class="floating-form mb-3">
    <input id="dateInput" value="<?= $today ?>" class="form-control" type="date" name="date" placeholder="Date" required>
    <label class="form-label">Date</label>
    <small class="text-muted" id="formattedDate">Today: <?= $formattedToday ?></small>
</div>

<script>
    const input = document.getElementById('dateInput');
    const display = document.getElementById('formattedDate');

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    function updateFormattedDate() {
        if (input.value) {
            const formatted = formatDate(input.value);
            if (input.value === '<?= $today ?>') {
                display.textContent = 'Today: ' + formatted;
            } else {
                display.textContent = 'Selected: ' + formatted;
            }
        } else {
            display.textContent = '';
        }
    }

    input.addEventListener('input', updateFormattedDate);
</script>

               <!-- end of date -->
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
<link href="assets/vendor/summernote/summernote-bs5.min.css" rel="stylesheet">
<script src="assets/vendor/summernote/summernote-bs5.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/perevoshchikov/summernote-grid@1.0.0/summernote-grid.min.js"></script>
<script>
    const pageTitleUrl = "<?= $page_title_url ?>";
    const pageName = "<?= $page_name ?>";
</script>
<script src="script.js"></script>
