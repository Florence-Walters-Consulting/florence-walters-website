<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';

	if($action === 'delete') {
		$id = $_POST['id'];
		$stmt = $con -> prepare('DELETE FROM email_subscribers WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
	}
}
?>