<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';
	
	if ($action === 'save') {
		$category_name = $_POST['category_name'];
		$section = $_POST['section'];
		$slug = makeSlug($category_name);
		$db_id=0;
		$stmt = $con -> prepare('INSERT INTO menu_categories VALUES (?,?,?,?)');
		$stmt -> bind_param('isss', $db_id,$category_name,$slug,$section);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully added.']);
        exit;
	}

	if($action === 'edit') {
		
		$id = $_POST['id'];
		$category_name = $_POST['category_name'];
		$section = $_POST['section'];
		$slug = makeSlug($category_name);
		$stmt = $con -> prepare('UPDATE menu_categories SET category_name=?, slug=?, section=? WHERE id=?');
		$stmt -> bind_param('sssi', $category_name,$slug,$section,$id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully updated.']);
        exit;
	}

	if($action === 'delete') {
		$id = $_POST['id'];
		$stmt = $con -> prepare('DELETE FROM menu_categories WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
	}
}
?>