<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';
	
	if ($action === 'save') {
		$name = $_POST['name'];
		$position = $_POST['position'];
		$social_media_link = $_POST['link'];
		
		if (!empty($_FILES["fileField"]["name"])) {
			$random_id = bin2hex(random_bytes(5));
			$extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
			move_uploaded_file( $_FILES['fileField']['tmp_name'], "../../site_img/team/$random_id.$extension");
			$picture ="$random_id.$extension";
		}	
			$db_id=0;
			$stmt = $con -> prepare('INSERT INTO team VALUES (?,?,?,?,?)');
			$stmt -> bind_param('issss', $db_id,$name,$position,$picture,$social_media_link);
			$stmt -> execute();
		
			echo json_encode([
    			'status' => 'success',
    			'message' => 'Item successfully added.'
			]);
			exit;
		
	}
	if($action === 'edit') {
		
		$id = $_POST['id'];
		$name = $_POST['name'];
		$position = $_POST['position'];
		$picture = $_POST['picture'];
		$social_media_link = $_POST['link'];
		
		if (!empty($_FILES["fileField"]["name"])) {
			unlink("../../site_img/team/$picture");
			$random_id = bin2hex(random_bytes(5));
			$extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
			move_uploaded_file( $_FILES['fileField']['tmp_name'], "../../site_img/team/$random_id.$extension");
			$picture ="$random_id.$extension";
		}
		$stmt = $con -> prepare('UPDATE team SET name=?, position=?, picture=?, link=? WHERE id=?');
		$stmt -> bind_param('ssssi', $name,$position,$picture,$social_media_link,$id);
		$stmt -> execute();
		echo json_encode([
    			'status' => 'success',
    			'message' => 'Item successfully updated.'
			]);
			exit;
	}

	if($action === 'delete') {
		$id = $_POST['id'];
		$picture = $_POST['picture'];
		unlink("../../site_img/team/$picture");
		$stmt = $con -> prepare('DELETE FROM team WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode([
    			'status' => 'success',
    			'message' => 'Item successfully deleted.'
			]);
			exit;
	}
}
?>