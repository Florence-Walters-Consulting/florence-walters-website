<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';
	
	if ($action === 'save') {
		$heading = $_POST['heading'];
		$paragraph = $_POST['paragraph'];
		
		if (!empty($_FILES["fileField"]["name"])) {
			$random_id = bin2hex(random_bytes(5));
			$extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
			move_uploaded_file( $_FILES['fileField']['tmp_name'], "../../site_img/home_background/$random_id.$extension");
			$picture ="$random_id.$extension";
			
			$db_id=0;
			$stmt = $con -> prepare('INSERT INTO picture_slider VALUES (?,?,?,?)');
			$stmt -> bind_param('isss', $db_id,$heading,$paragraph,$picture);
			$stmt -> execute();
		
			echo json_encode(['status' => 'success', 'message' => 'Item sucessfully added.']);
        exit;
		}
		else{ echo"No picture found to upload.";}
	}
	if($action === 'edit') {
		
		$id = $_POST['id'];
		$heading = $_POST['heading'];
		$paragraph = $_POST['paragraph'];
		$picture = $_POST['picture'];
		
		if (!empty($_FILES["fileField"]["name"])) {
			unlink("../../site_img/home_background/$picture");
			$random_id = bin2hex(random_bytes(5));
			$extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
			move_uploaded_file( $_FILES['fileField']['tmp_name'], "../../site_img/home_background/$random_id.$extension");
			$picture ="$random_id.$extension";
		}
		$stmt = $con -> prepare('UPDATE picture_slider SET heading=?, paragraph=?, picture=? WHERE id=?');
		$stmt -> bind_param('sssi', $heading,$paragraph,$picture,$id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully updated.']);
        exit;
	}

	if($action === 'delete') {
		$id = $_POST['id'];
		$picture = $_POST['picture'];
		unlink("../../site_img/home_background/$picture");
		$stmt = $con -> prepare('DELETE FROM picture_slider WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
	}
}
?>