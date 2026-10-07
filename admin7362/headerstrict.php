<?php include ("../api/config.php"); 
if (!isset($_SESSION["manager"])) {
    header("location: index.php"); 
    exit();
}
$manager = $_SESSION["manager"];
$admin_name = $_SESSION["admin_name"];
$admin_email = $_SESSION["email"];
$admin_type = $_SESSION["admin_type"];
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
    <meta content="IE=edge" http-equiv="X-UA-Compatible">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <meta content="" name="description">
    <meta content="" name="keywords">
    <meta content="la-themes" name="author">
    <link href="../site_img/favicon.png" rel="icon" type="image/x-icon">
    <link href="../site_img/favicon.png" rel="shortcut icon" type="image/x-icon">

    <!--font-awesome-css-->
    <link href="assets/vendor/fontawesome/css/all.css" rel="stylesheet">

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/" rel="preconnect">
    <link crossorigin href="https://fonts.gstatic.com/" rel="preconnect">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&amp;display=swap"
        rel="stylesheet">

    <!-- Bootstrap css-->
    <link href="assets/vendor/bootstrap/bootstrap.min.css" rel="stylesheet" type="text/css">

    <!-- simplebar css-->
    <link href="assets/vendor/simplebar/simplebar.css" rel="stylesheet" type="text/css">

    <!-- glight css -->
    <link href="assets/vendor/glightbox/glightbox.min.css" rel="stylesheet">

    <!-- App css-->
    <link href="assets/css/style.css" rel="stylesheet" type="text/css">

    <!-- Responsive css-->
    <link href="assets/css/responsive.css" rel="stylesheet" type="text/css">
    <style>
        :root,
        .app-wrapper.default {
            --primary: <?= htmlspecialchars($admin_primary_color, ENT_QUOTES, 'UTF-8') ?>;
            --secondary: <?= htmlspecialchars($admin_secondary_color, ENT_QUOTES, 'UTF-8') ?>;
        }

        body.ltr.dark .admin_icons i,
        body.ltr.dark .btn-primary,
        body.ltr.dark .btn-secondary,
        body.ltr.dark .btn-success,
        body.ltr.dark .btn-danger,
        body.ltr.dark .btn-warning,
        body.ltr.dark .btn-info,
        body.ltr.dark .btn-dark,
        body.ltr.dark .btn-light-primary,
        body.ltr.dark .btn-light-secondary,
        body.ltr.dark .btn-light-success,
        body.ltr.dark .btn-light-danger,
        body.ltr.dark .btn-light-warning,
        body.ltr.dark .btn-light-info {
            color: #ffffff !important;
        }
    </style>
</head>

<body>
    <div class="app-wrapper">
        <div class="loader-wrapper">
            <div class="app-loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <!-- Menu Navigation starts -->
        <nav>
            <div class="app-logo">
                <a class="logo d-inline-block" href="index.php">
                    <img alt="#" src="../site_img/logo.png" style='border-radius:5px;'>
                </a>

                <span class="bg-light-primary toggle-semi-nav">
                    <i class="fa-solid fa-angles-right f-s-20"></i>
                </span>
            </div>
            <div class="app-nav" id="app-simple-bar">
                <ul class="main-nav p-0 mt-2">

                    <li class="no-sub">
                        <a class="side_icon <?php if($page_name == "adminhome.php"){echo"activee";} ?>" href="index.php">
                            <i class="fa fa-home"></i> Main Dashboard
                        </a>
                    </li>

                    <li>
                        <a aria-expanded="false" class="side_icon" data-bs-toggle="collapse" href="#images">
                            <i class="fa fa-image"></i>
                            Images
                            <span class="badge text-primary-dark bg-primary-300  badge-notification ms-2">2</span>
                        </a>
                        <ul class="collapse" id="images">
                            <li><a href="home_slider">Home Slider</a></li>
                            <li><a href="other_images">Other Images</a></li>

                        </ul>
                    </li>


                    <li class="no-sub">
                        <a class="side_icon <?php if($page_name == "services.php"){echo"activee";} ?>" href="services">
                            <i class="fa fa-briefcase"></i> Services
                        </a>
                    </li>



                    <!--<li class="no-sub">
                        <a class="side_icon <?php if($page_name == "projects.php"){echo"activee";} ?>" href="projects">
                            <i class="fa fa-building"></i> Projects
                        </a>
                    </li>-->

                    <li>
                        <a aria-expanded="false" class="side_icon" data-bs-toggle="collapse" href="#settings">
                            <i class="fa fa-gear"></i>
                            Settings
                            <span class="badge text-primary-dark bg-primary-300  badge-notification ms-2">1</span>
                        </a>
                        <ul class="collapse" id="settings">
                            <!--<li><a href="#">Settings</a></li>-->
                            <li><a href="password">Change your Password</a></li>

                        </ul>
                    </li>

                    <li>
                        <a aria-expanded="false" class="side_icon" data-bs-toggle="collapse" href="#blog">
                            <i class="fa fa-book"></i>
                            Blog
                            <span class="badge text-primary-dark bg-primary-300  badge-notification ms-2">2</span>
                        </a>
                        <ul class="collapse" id="blog">
                            <li><a href="blog">Blog Posts</a></li>
                            <li><a href="blog_categories">Blog Categories</a></li>
                        </ul>
                    </li>

                    <li class="no-sub">
                        <a class="side_icon <?php if($page_name == "faqs.php"){echo"activee";} ?>" href="faqs">
                            <i class="fa fa-question"></i> FAQs
                        </a>
                    </li>

                    <!--<li class="no-sub">
                        <a class="side_icon <?php if($page_name == "testimonials.php"){echo"activee";} ?>" href="testimonials">
                            <i class="fa fa-microphone"></i> Testimonials
                        </a>
                    </li>

                    <li class="no-sub">
                        <a class="side_icon <?php if($page_name == "team.php"){echo"activee";} ?>" href="team">
                            <i class="fa fa-user"></i> Team
                        </a>
                    </li>

                    <li class="no-sub">
                        <a class="side_icon <?php if($page_name == "partners.php"){echo"activee";} ?>" href="partners">
                            <i class="fa fa-handshake"></i> Partners
                        </a>
                    </li>-->

                    <li class="no-sub">
                        <a class="side_icon <?php if($page_name == "emails.php"){echo"activee";} ?>" href="emails">
                            <i class="fa fa-envelope"></i> Emails
                        </a>
                    </li>

                    <li class="no-sub">
                        <a class="side_icon" href="logout">
                            <i class="fa fa-hand-peace"></i> Logout
                        </a>
                    </li>






                </ul>

            </div>
            <script>
            document.addEventListener("DOMContentLoaded", function() {
                const icons = document.querySelectorAll(".side_icon i");
                icons.forEach(icon => {
                    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
                    icon.style.color = randomColor;
                });
            });
            </script>

            <div class="menu-navs">
                <span class="menu-previous"><i class="fa-solid fa-chevron-left"></i></span>
                <span class="menu-next"><i class="fa-solid fa-chevron-right"></i></span>
            </div>

        </nav>
        <!-- Menu Navigation ends -->


        <div class="app-content">
            <div class="">

                <!-- Header Section starts -->
                <header class="header-main">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-6 col-sm-4 d-flex align-items-center header-left p-0">
                                <span class="header-toggle me-3">
                                    <i class="fa-solid fa-grip"></i>
                                </span>
                            </div>

                            <div class="col-6 col-sm-8 d-flex align-items-center justify-content-end header-right p-0">

                                <ul class="d-flex align-items-center">
                                    <li class="header-dark">
                                        <div class="sun-logo head-icon">
                                            <i class="fa-solid fa-sun"></i>
                                        </div>
                                        <div class="moon-logo head-icon">
                                            <i class="fa-solid fa-moon"></i>
                                        </div>
                                    </li>

                                    <!--<li class="header-notification">
                                    <a aria-controls="notificationcanvasRight"
                                       class="d-block head-icon position-relative"
                                       data-bs-target="#notificationcanvasRight"
                                       data-bs-toggle="offcanvas"
                                       href="#"
                                       role="button">
                                        <i class="fa-solid fa-bell"></i>
                                        <span
                                                class="position-absolute translate-middle p-1 bg-success border border-light rounded-circle animate__animated animate__fadeIn animate__infinite animate__slower"></span>
                                    </a>
                                    <div aria-labelledby="notificationcanvasRightLabel"
                                         class="offcanvas offcanvas-end header-notification-canvas"
                                         id="notificationcanvasRight" tabindex="-1">
                                        <div class="offcanvas-header">
                                            <h5 class="offcanvas-title" id="notificationcanvasRightLabel">
                                                Notification</h5>
                                            <button aria-label="Close" class="btn-close" data-bs-dismiss="offcanvas"
                                                    type="button"></button>
                                        </div>
                                        <div class="offcanvas-body notification-offcanvas-body app-scroll p-0">
                                            <div class="head-container notification-head-container">
                                                <div class="notification-message head-box">
                                                    <div class="message-images">
                                                          <span class="bg-secondary h-35 w-35 d-flex-center b-r-10 position-relative">
                                                            <img alt="avtar" class="img-fluid b-r-10"
                                                                 src="assets/images/ai_avtar/6.jpg">
                                                            <span
                                                                    class="position-absolute bottom-30 end-0 p-1 bg-secondary border border-light rounded-circle notification-avtar"></span>
                                                          </span>
                                                    </div>
                                                    <div class="message-content-box flex-grow-1 ps-2">

                                                        <a class="f-s-15 text-secondary mb-0"
                                                           href="read_email.html" target="_blank"><span
                                                                class="f-w-500 text-secondary">Gene Hart</span> wants to
                                                            edit <span
                                                                    class="f-w-500 text-secondary">Report.doc</span></a>
                                                        <div>
                                                            <a class="d-inline-block f-w-500 text-success me-1"
                                                               href="#">Approve</a>
                                                            <a class="d-inline-block f-w-500 text-danger"
                                                               href="#">Deny</a>
                                                        </div>
                                                        <span class="badge text-light-primary mt-2"> sep 23 </span>

                                                    </div>
                                                    <div class="align-self-start text-end">
                                                        <i class="fa-solid fa-xmark close-btn"></i>
                                                    </div>
                                                </div>
                                                <div class="notification-message head-box">
                                                    <div class="message-images">
                                                        <span class="bg-light-dark h-35 w-35 d-flex-center b-r-10 position-relative">
                                                          <i class="fa-solid fa-truck f-s-18"></i>
                                                        </span>
                                                    </div>
                                                    <div class="message-content-box flex-grow-1 ps-2">
                                                        <a class="f-s-15 text-secondary mb-0" href="read_email.html"
                                                           target="_blank">Hey
                                                            <span
                                                                    class="f-w-500 text-secondary">Emery McKenzie</span>,
                                                            get ready: Your order from <span
                                                                    class="f-w-500 text-secondary">@Shopper.com</span>
                                                            is out for delivery today!</a>
                                                        <span class="badge text-light-info mt-2"> sep 23 </span>

                                                    </div>
                                                    <div class="align-self-start text-end">
                                                        <i class="fa-solid fa-xmark close-btn"></i>
                                                    </div>
                                                </div>
                                                <div class="notification-message head-box">
                                                    <div class="message-images">
                                                       <span class="bg-secondary h-35 w-35 d-flex-center b-r-10 position-relative">
                                                         <img alt="" class="img-fluid b-r-10"
                                                              src="assets/images/ai_avtar/2.jpg">
                                                         <span
                                                                 class="position-absolute  end-0 p-1 bg-secondary border border-light rounded-circle notification-avtar"></span>
                                                       </span>
                                                    </div>
                                                    <div class="message-content-box flex-grow-1 ps-2">
                                                        <a class="f-s-15 text-secondary mb-0"
                                                           href="read_email.html" target="_blank"><span
                                                                class="f-w-500 text-secondary">Simon Young</span> shared
                                                            a file called <span
                                                                    class="f-w-500 text-secondary">Dropdown.pdf</span></a>
                                                        <span class="badge text-light-success mt-2"> 30 min</span>

                                                    </div>
                                                    <div class="align-self-start text-end">
                                                        <i class="fa-solid fa-xmark close-btn"></i>
                                                    </div>
                                                </div>
                                                <div class="notification-message head-box">
                                                    <div class="message-images">
                                                       <span class="bg-secondary h-35 w-35 d-flex-center b-r-10 position-relative">
                                                         <img alt="" class="img-fluid b-r-10"
                                                              src="assets/images/ai_avtar/5.jpg">
                                                         <span
                                                                 class="position-absolute end-0 p-1 bg-secondary border border-light rounded-circle notification-avtar"></span>
                                                       </span>
                                                    </div>
                                                    <div class="message-content-box flex-grow-1 ps-2">
                                                        <a class="f-s-15 text-secondary mb-0"
                                                           href="read_email.html" target="_blank"><span
                                                                class="f-w-500 text-secondary">Becky G. Hayes</span> has
                                                            added a comment to <span
                                                                    class="f-w-500 text-secondary">Final_Report.pdf</span></a>
                                                        <span class="badge text-light-warning mt-2"> 45 min</span>
                                                    </div>
                                                    <div class="align-self-start text-end">
                                                        <i class="fa-solid fa-xmark close-btn"></i>
                                                    </div>
                                                </div>
                                                <div class="notification-message head-box">
                                                    <div class="message-images">
                                                        <span class="bg-secondary h-35 w-35 d-flex-center b-r-10 position-relative">
                                                          <img alt="" class="img-fluid b-r-10"
                                                               src="assets/images/ai_avtar/1.jpg">
                                                          <span
                                                                  class="position-absolute  end-0 p-1 bg-secondary border border-light rounded-circle notification-avtar"></span>
                                                        </span>
                                                    </div>
                                                    <div class="message-content-box flex-grow-1 ps-2">
                                                        <a class="f-s-15 text-secondary mb-0"
                                                           href="read_email.html" target="_blank"><span
                                                                class="f-w-600 text-secondary">Romaine Nadeau</span>
                                                            invited you to join a meeting
                                                        </a>
                                                        <div>
                                                            <a class="d-inline-block f-w-500 text-success me-1"
                                                               href="#">Join</a>
                                                            <a class="d-inline-block f-w-500 text-danger" href="#">Decline</a>
                                                        </div>

                                                        <span class="badge text-light-secondary mt-2"> 1 hour ago </span>
                                                    </div>
                                                    <div class="align-self-start text-end">
                                                        <i class="fa-solid fa-xmark close-btn"></i>
                                                    </div>
                                                </div>

                                                <div class="hidden-massage py-4 px-3">
                                                    <img alt=""
                                                         class="w-50 h-50 mb-3 mt-2"
                                                         src="assets/images/icons/bell.png">
                                                    <div>
                                                        <h6 class="mb-0">Notification Not Found</h6>
                                                        <p class="text-secondary">When you have any notifications added
                                                            here,will
                                                            appear here.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </li>-->


                                </ul>
                            </div>
                        </div>
                    </div>
                </header>
                <!-- Header Section ends -->
