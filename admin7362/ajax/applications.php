<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';

	if($action === 'delete') {
		$cv = $_POST['cv'];
		unlink("../../apply/cvs/$cv");
		$id = $_POST['id'];
		$stmt = $con -> prepare('DELETE FROM applications WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
	}
}
?>