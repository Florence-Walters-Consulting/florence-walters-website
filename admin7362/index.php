<?php session_start();
include ("../api/config.php"); 
if (isset($_SESSION["manager"])) {
    header("location: adminhome.php"); 
}
?>
<?php
$admin_name = "";
$error="";
if(isset($_POST['button'])) {
    $manager = $_POST['username'];
    $password = $_POST['password'];	
    $stmt = $con->prepare("SELECT * FROM admin WHERE username=? AND password=? LIMIT 1");
	$stmt->bind_param("ss",$manager,$password);
	$stmt->execute();
	$stmt -> store_result();
    $stmt -> bind_result($id,$admin_name,$admin_email,$manager,$p,$admin_type);
    $stmt -> fetch();
	$existCount = $stmt -> num_rows;

    if ($existCount == 1) {
        $_SESSION["manager"] = $manager;
        $_SESSION["admin_name"] = $admin_name;
        $_SESSION["email"] = $admin_email;
        $_SESSION["admin_type"] = $admin_type;
        header("location: adminhome.php");
    }else{$error = "Wrong username or password";} 
}
?>
<title><?php echo $company_name; ?> Admin login</title>
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

    <!-- App css-->
    <link href="assets/css/style.css" rel="stylesheet" type="text/css">

    <!-- Responsive css-->
    <link href="assets/css/responsive.css" rel="stylesheet" type="text/css">

</head>

<body>
    <div class="app-wrapper d-block">
        <div class="">
            <!-- Body main section starts -->
            <main class="w-100 p-0">
                <!-- Login to your Account start -->
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12 p-0">
                            <div class="login-form-container">
                                <div class="mb-4">
                                    <a class="logo d-inline-block" href="index.php">
                                        <img alt="#" src="../site_img/logo.png" width="250" style='border-radius:5px;'>
                                    </a>
                                </div>
                                <div class="form_container"> <br>
                                    <div style='color:crimson;text-align:center;'><?= $error ?></div>
                                    <form action='index.php' method='post' class="app-form rounded-control">
                                        <div class="mb-3 text-center">
                                            <h3 class="text-primary-dark">Login to your account</h3>
                                            <p class="f-s-12 text-secondary">Welcome back! To get started simply fill in the fields below:</p>
                                        </div>
                                        <div class="floating-form mb-3">
                                            <input class="form-control" type="text" name="username" id="username" placeholder="Enter your username" required>
                                            <label for='username' class="form-label">Username</label>
                                        </div>
                                        <div class="floating-form mb-3 password-wrapper">

                                            <input class="form-control" type="password" name='password' id="passwd" placeholder='Enter your password' required>
                                            <i class="fa-solid fa-eye-slash" onclick="togglePasswordVisibility()" id="toggleIcon"></i>
                                            <label class="form-label">Password</label>
                                        </div>
                                        <script>
                                        function togglePasswordVisibility() {
                                            const passwordInput = document.getElementById('passwd');
                                            const icon = document.getElementById('toggleIcon');

                                            if (passwordInput.type === 'password') {
                                                passwordInput.type = 'text';
                                                icon.classList.remove('fa-eye-slash');
                                                icon.classList.add('fa-eye');
                                            } else {
                                                passwordInput.type = 'password';
                                                icon.classList.remove('fa-eye');
                                                icon.classList.add('fa-eye-slash');
                                            }
                                        }
                                        </script>

                                        <div>
                                            <button type='submit' name='button' class="btn btn-light-primary w-100" role="button">Submit</button>
                                        </div>



                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Login to your Account end -->
            </main>
            <!-- Body main section ends -->
        </div>
    </div>
    <!-- latest jquery-->
    <script src="assets/js/jquery-3.6.3.min.js"></script>

    <!-- Bootstrap js-->
    <script src="assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>

</body>

</html>
