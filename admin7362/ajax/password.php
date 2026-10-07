<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    header('Content-Type: application/json'); // <-- Return JSON

	$action = $_POST['action'] ?? '';
	if($action === 'edit') {
		
		$manager = $_POST['manager'];
		$old_password = $_POST['old_password'];
		$new_password = $_POST['new_password'];

		// is old password correct?
		$stmt = $con->prepare("SELECT password FROM admin WHERE username=? AND password=? LIMIT 1");
		$stmt->bind_param("ss", $manager, $old_password);
		$stmt->execute();
		$stmt->store_result();

		if ($stmt->num_rows === 1) {
			$stmt1 = $con->prepare("UPDATE admin SET password=? WHERE username=?");
			$stmt1->bind_param("ss", $new_password, $manager);
			$stmt1->execute();

			echo json_encode([
				"status" => "success",
				"message" => "Password successfully updated."
			]);
		} else {
			echo json_encode([
				"status" => "error",
				"message" => "Old password is incorrect."
			]);
		}
	}
}
?>
