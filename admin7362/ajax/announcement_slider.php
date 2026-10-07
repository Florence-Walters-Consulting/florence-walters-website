<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';
	
	if ($action === 'save') {
		$text = $_POST['text'];
		$db_id=0;
		$stmt = $con -> prepare('INSERT INTO announcement_slider VALUES (?,?)');
		$stmt -> bind_param('is', $db_id,$text);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully added.']);
        exit;
	}

	if($action === 'edit') {
		
		$id = $_POST['id'];
		$text = $_POST['text'];

		$stmt = $con -> prepare('UPDATE announcement_slider SET text=? WHERE id=?');
		$stmt -> bind_param('si', $text,$id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully updated.']);
        exit;
	}

	if($action === 'delete') {
		$id = $_POST['id'];
		$stmt = $con -> prepare('DELETE FROM announcement_slider WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
        echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
		
	}
}
?>