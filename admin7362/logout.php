<?php
session_start();
session_destroy();

setcookie("Auth_ad", "", time() - 3600, "/"); // 86400 = 1 day
setcookie("username", "", time() - 3600, "/"); // 86400 = 1 day
		
header("Location: ./");
?>