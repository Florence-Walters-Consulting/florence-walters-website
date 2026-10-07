<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';
	if($action === 'edit') {
		
		$id = $_POST['id'];

		$stmt_c = $con -> prepare('SELECT display FROM comments WHERE id=?');
		$stmt_c -> bind_param('i',$id);
		$stmt_c -> execute();
		$stmt_c -> store_result();
		$stmt_c -> bind_result($display);
		$numrows_c = $stmt_c -> num_rows();
		if($numrows_c > 0){
			while ($stmt_c -> fetch()) {
				if($display == "Yes"){
					$new_display = "No";
				}
				else{$new_display = "Yes";}
			}
		}
		
		$stmt = $con -> prepare('UPDATE comments SET display=? WHERE id=?');
		$stmt -> bind_param('si', $new_display,$id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully updated.']);
        exit;
	}

	if($action === 'delete') {
		$id = $_POST['id'];
		$stmt = $con -> prepare('DELETE FROM comments WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
	}
}
?>