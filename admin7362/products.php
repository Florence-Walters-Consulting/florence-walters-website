<?php
session_start();
$page_name = basename($_SERVER['PHP_SELF']);
include("headerstrict.php");
$page_title = "Products";
$page_title_url = "products_";
?>
<title><?= $company_name; ?> - <?= $page_title ?></title>

<main>
    <div class="container-fluid">

        <div class="row m-1">
            <div class="col-12">
                <h4 class="main-title"><?= $page_title ?></h4>
            </div>
        </div>

        <div class="row">

            <div class="col-lg-8">

                <form id="theForm" class="app-form rounded-control" enctype="multipart/form-data">
                    <div class="floating-form mb-3">
                        <input
                            class="form-control" type="text" name="name" placeholder="Product Name"
                            required>
                        <label class="form-label"> Product Name</label>
                    </div>
                    <div class="form-floating mb-3">
                        <select class="form-control" name="category_id" required>
                            <option value="">Select Category</option>
                            <?php
                            $query = "SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC";
                            $result = mysqli_query($con, $query);
                            while ($row = mysqli_fetch_assoc($result)) {
                            ?>
                            <option value="<?= $row['id'] ?>"><?= htmlspecialchars($row['name']) ?></option>
                            <?php } ?>
                        </select>
                        <label class="form-floating form-label">Category</label>
                    </div>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="text" name="brand" placeholder="Brand">
                        <label class="form-label">Brand</label>
                    </div>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="text" name="volume" placeholder="Volume">
                        <label class="form-label">Size</label>
                    </div>
                    <div class="mb-3">
                        <label>Description</label>
                        <textarea class="form-control summernote" name="body" placeholder="Description" style="height:200px;"></textarea>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="floating-form mb-3">
                                <input
                                    class="form-control" type="number" name="price" min="0" step="0.01" required>
                                <label class="form-label">Price</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="floating-form mb-3">
                                <input class="form-control" type="number" name="sale_price" min="0" step="0.01">
                                <label class="form-label">Sale Price</label>
                            </div>
                        </div>
                    </div>
                    <div class="floating-form mb-3">
                        <input class="form-control" type="number" name="stock_quantity" min="0" value="0" required>
                        <label class="form-label">Stock Quantity</label>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <select class="form-control" name="is_featured">
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                                <label class="form-floating form-label">Featured Product</label>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <select class="form-control" name="is_active">
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                                <label class="form-floating form-label">Active</label>
                            </div>
                        </div>
                    </div>

                    <div class='row'>
                        <div class='col-md-12'>
                            <h5>Images</h5>
                            <small class="text-muted">The first image is the primary image and is required. Other images are optional.</small>
                        </div>

                        <div class='col-md-4'>
                            <div class="form-floating mb-3">
                                <input class="form-control" type="file" name='fileField' accept="image/*" required>
                                <label class="form-floating form-label">Primary Image*</label>
                            </div>
                        </div>
                        <div class='col-md-4'>
                            <div class="form-floating mb-3">
                                <input class="form-control" type="file" name='fileField2' accept="image/*">
                                <label class="form-floating form-label">Image 2</label>
                            </div>
                        </div>
                        <div class='col-md-4'>
                            <div class="form-floating mb-3">
                                <input class="form-control" type="file" name='fileField3' accept="image/*">
                                <label class="form-floating form-label">Image 3</label>
                            </div>
                        </div>
                        <div class='col-md-4'>
                            <div class="form-floating mb-3">
                                <input class="form-control" type="file" name='fileField4' accept="image/*">
                                <label class="form-floating form-label">Image 4</label>
                            </div>
                        </div>
                        <div class='col-md-4'>
                            <div class="form-floating mb-3">
                                <input class="form-control" type="file" name='fileField5' accept="image/*">
                                <label class="form-floating form-label">Image 5</label>
                            </div>
                        </div>
                        <div class='col-md-4'>
                            <div class="form-floating mb-3">
                                <input class="form-control" type="file" name='fileField6' accept="image/*">
                                <label class="form-floating form-label">Image 6</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit" name="action" value="save"
                            class="btn btn-light-primary">Save
                        </button>
                    </div>
                </form>

            </div>

        </div>

        <hr>

        <div class="row mt-4 mb-4">
            <div class="col-12">
                <h4 class="main-title">Uploaded Products</h4>
            </div>
        </div>

        <div id="data" class="row"></div>

    </div>
</main>

<?php include("footer.php"); ?>

<link
    href="assets/vendor/summernote/summernote-bs5.min.css"
    rel="stylesheet">

<script src="assets/vendor/summernote/summernote-bs5.min.js"></script>

<script src="https://cdn.jsdelivr.net/gh/perevoshchikov/summernote-grid@1.0.0/summernote-grid.min.js"></script>

<script>
const pageTitleUrl = "<?= $page_title_url ?>";

const pageName = "<?= $page_name ?>";
</script>
<script src="script.js"></script>
