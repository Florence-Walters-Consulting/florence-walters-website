 <!-- tap on top -->
 <div class="go-top">
     <span class="progress-value">
         <i class="fa fa-arrow-up"></i>
     </span>
 </div>
 <!-- Footer Section starts-->
 <footer>
     <div class="container-fluid">
         <div class="row">
             <div class="col-md-6 col-12">
                 <ul class="footer-text">
                     <li>
                         <p class="mb-0">Copyright © <?php $odun = date('Y'); echo"$odun $company_name"; ?>. All rights reserved 💖</p>
                     </li>

                 </ul>
             </div>
             <div class="col-md-6">
                 <?php if($admin_name){ ?>
                 <a style='float:right;' href="#">Logged in as <?= $admin_name ?></a>
                 <?php } ?>
             </div>
         </div>
     </div>
 </footer>
 <!-- Footer Section ends-->
 </div>
 </div>
 </div>


 <!--customizer-->
 <div id="customizer"></div>

 <!-- latest jquery-->
 <script src="assets/js/jquery-3.6.3.min.js"></script>

 <!-- Simple bar js-->
 <script src="assets/vendor/simplebar/simplebar.js"></script>

 <!-- Bootstrap js-->
 <script src="assets/vendor/bootstrap/bootstrap.bundle.min.js"></script>

 <!-- Glight js -->
 <script src="assets/vendor/glightbox/glightbox.min.js"></script>

 <!--js-->
 <script src="assets/js/blog.js"></script>

 <!-- sweetalert js-->
 <script src="assets/vendor/sweetalert/sweetalert.js"></script>

 <!-- App js-->
 <script src="assets/js/script.js"></script>

 <!-- Customizer js-->
 <script src="assets/js/customizer.js"></script>
 </body>

 </html>
