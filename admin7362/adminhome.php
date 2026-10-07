<?php session_start();
$page_name = basename($_SERVER['PHP_SELF']); 
include("headerstrict.php"); ?>
<title><?php echo $company_name; ?> Admin login</title>
<style>
body.ltr.dark .admin_card .card-header h1,
body.ltr.dark .admin_card .card-header h5,
body.ltr.dark .admin_card .card-header p,
body.ltr.dark .admin_card .card-header .admin_icons {
    color: #ffffff !important;
}
</style>
<!-- Body main section starts -->
<main>
    <div class="container-fluid mt-3">
        <div class='row admin-dashboard-gri'>

            <?php 
            $stmt_ps = $con->prepare("SELECT COUNT(*) FROM picture_slider");
            $stmt_ps->execute();
            $stmt_ps->bind_result($no_ps);
            $stmt_ps->fetch();
            $stmt_ps->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="home_slider">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Home Slider</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-image"></i>
                            </span>
                            <h1><?= $no_ps ?></h1>
                            <p class='mb-3'>Add, update or remove slides from the home image slider</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_gi = $con->prepare("SELECT COUNT(*) FROM general_images WHERE display = 'Yes'");
            $stmt_gi->execute();
            $stmt_gi->bind_result($no_gi);
            $stmt_gi->fetch();
            $stmt_gi->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="other_images">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Other Images</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-image"></i>
                            </span>
                            <h1><?= $no_gi ?></h1>
                            <p class='mb-3'>Update general images on the website, including page headers</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_s = $con->prepare("SELECT COUNT(*) FROM services");
            $stmt_s->execute();
            $stmt_s->bind_result($no_s);
            $stmt_s->fetch();
            $stmt_s->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="services">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Services</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-tools"></i>
                            </span>
                            <h1><?= $no_s ?></h1>
                            <p class='mb-3'>Add, update or delete your services.</p>
                        </div>
                    </div>
                </a>
            </div>


            <?php 
            $stmt_bc = $con->prepare("SELECT COUNT(*) FROM blog_categories");
            $stmt_bc->execute();
            $stmt_bc->bind_result($no_bc);
            $stmt_bc->fetch();
            $stmt_bc->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="blog_categories">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Blog Categories</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-book"></i>
                            </span>
                            <h1><?= $no_bc ?></h1>
                            <p class='mb-3'>Add, update or delete blog categories.</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_bp = $con->prepare("SELECT COUNT(*) FROM blog");
            $stmt_bp->execute();
            $stmt_bp->bind_result($no_bp);
            $stmt_bp->fetch();
            $stmt_bp->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="blog">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Blog Posts</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-book"></i>
                            </span>
                            <h1><?= $no_bp ?></h1>
                            <p class='mb-3'>Add, update or delete your blog posts.</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_fa = $con->prepare("SELECT COUNT(*) FROM faqs");
            $stmt_fa->execute();
            $stmt_fa->bind_result($no_fa);
            $stmt_fa->fetch();
            $stmt_fa->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="faqs">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>FAQs</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-question"></i>
                            </span>
                            <h1><?= $no_fa ?></h1>
                            <p class='mb-3'>Add, update or delete your frequently asked questions.</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_tea = $con->prepare("SELECT COUNT(*) FROM team");
            $stmt_tea->execute();
            $stmt_tea->bind_result($no_tea);
            $stmt_tea->fetch();
            $stmt_tea->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="team">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Team</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-users"></i>
                            </span>
                            <h1><?= $no_tea ?></h1>
                            <p class='mb-3'>Add, update and delete your team members.</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_pa = $con->prepare("SELECT COUNT(*) FROM partners");
            $stmt_pa->execute();
            $stmt_pa->bind_result($no_pa);
            $stmt_pa->fetch();
            $stmt_pa->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="partners">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Partners</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-handshake"></i>
                            </span>
                            <h1><?= $no_pa ?></h1>
                            <p class='mb-3'>Add, update and delete the logos of your partners.</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_te = $con->prepare("SELECT COUNT(*) FROM testimonials");
            $stmt_te->execute();
            $stmt_te->bind_result($no_te);
            $stmt_te->fetch();
            $stmt_te->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="testimonials">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Testimonials</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-bullhorn"></i>
                            </span>
                            <h1><?= $no_te ?></h1>
                            <p class='mb-3'>Add, update, hide or delete testimonials.</p>
                        </div>
                    </div>
                </a>
            </div>

            <?php 
            $stmt_e = $con->prepare("SELECT COUNT(*) FROM email_subscribers");
            $stmt_e->execute();
            $stmt_e->bind_result($no_e);
            $stmt_e->fetch();
            $stmt_e->close();
            ?>
            <div class="col-6 col-md-6 col-xl-3">
                <a href="emails">
                    <div class="card hover-effect card-primary admin_card">
                        <div class="card-header code-header">
                            <h5>Email Subscribers</h5>
                            <span class='admin_icons'>
                                <i class="fa fa-envelope"></i>
                            </span>
                            <h1><?= $no_e ?></h1>
                            <p class='mb-3'>View emails submitted via the newsletter form.</p>
                        </div>
                    </div>
                </a>
            </div>



        </div>
    </div>
</main>

</div>
</div>
<!-- Body main section ends -->
<?php include("footer.php"); ?>