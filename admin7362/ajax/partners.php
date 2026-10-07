<?php include("../../api/config.php"); ?>
<?php
$table_name = "partners";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';
	
	if ($action === 'save') {
		
		if (!empty($_FILES["fileField"]["name"])) {
			$random_id = bin2hex(random_bytes(5));
			$extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
			move_uploaded_file( $_FILES['fileField']['tmp_name'], "../../site_img/$table_name/$random_id.$extension");
			$picture ="$random_id.$extension";
		}	
			$stmt = $con -> prepare("INSERT INTO $table_name (picture) VALUES (?)");
			$stmt -> bind_param('s', $picture);
			$stmt -> execute();
		
			echo json_encode(['status' => 'success', 'message' => 'Item sucessfully added.']);
        exit;
		
	}
	if($action === 'edit') {
		
		$id = $_POST['id'];
		$picture = $_POST['picture'];
		
		if (!empty($_FILES["fileField"]["name"])) {
			unlink("../../site_img/$table_name/$picture");
			$random_id = bin2hex(random_bytes(5));
			$extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
			move_uploaded_file( $_FILES['fileField']['tmp_name'], "../../site_img/$table_name/$random_id.$extension");
			$picture ="$random_id.$extension";
		}
		$stmt = $con -> prepare("UPDATE $table_name SET picture=? WHERE id=?");
		$stmt -> bind_param('si', $picture,$id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully updated.']);
        exit;
	}

	if($action === 'delete') {
		$id = $_POST['id'];
		$picture = $_POST['picture'];
		unlink("../../site_img/$table_name/$picture");
		$stmt = $con -> prepare("DELETE FROM $table_name WHERE id = ?");
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
	}
}
?>