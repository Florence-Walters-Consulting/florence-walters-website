<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$id = $_POST['id'] ?? '';
	$action = $_POST['action'] ?? '';
	$location = $_POST['location'] ?? '';
	$fee = $_POST['fee'] ?? '';

	if ($action === 'save') {
		$db_id=0;
		$empty = "";
		$stmt = $con -> prepare('INSERT INTO delivery_zones VALUES (?,?,?,?)');
		$stmt -> bind_param('isss', $db_id,$fee,$location,$empty);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully added.']);
        exit;
	}

	if($action === 'edit') {
		$stmt = $con -> prepare('UPDATE delivery_zones SET location=?, fee=? WHERE id=?');
		$stmt -> bind_param('ssi', $location,$fee,$id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully updated.']);
        exit;
	}

	if($action === 'delete') {
		$stmt = $con -> prepare('DELETE FROM delivery_zones WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
	}
}
?>