<?php include("../../api/config.php"); ?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	$action = $_POST['action'] ?? '';
	$category_name = trim($_POST['category_name'] ?? '');
	$slug = makeSlug($category_name);
		
	if ($action === 'save') {
		$new_picture = '';
		$new_picture = uploadImage("fileField","categories",400);
		$is_active = 1;	
		$stmt = $con->prepare('INSERT INTO categories (name, slug, picture, is_active) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('sssi', $category_name, $slug, $new_picture, $is_active);
		$stmt -> execute();
		
		echo json_encode(['status' => 'success', 'message' => 'Item sucessfully added.']);
        exit;
	}

	if($action === 'edit') {
		$id = $_POST['id'];
		$is_active = $_POST['is_active'] ?? 1;

		$picture = $_POST['picture'] ?? '';
		$current_pics = [
            'fileField'  => $picture
        ];

		$final_pics = [];
        foreach ($current_pics as $field => $oldFileName) {
            if (!empty($_FILES[$field]["name"])) {
                // Delete old main image and thumbnail
                if (!empty($oldFileName)) {
                    $path = "../../site_img/categories/$oldFileName";
                    if (file_exists($path)) @unlink($path);
                }
                
                $final_pics[$field] = uploadImage($field, "categories", 400);
            } else {
                // No new file, keep existing
                $final_pics[$field] = $oldFileName;
            }
        }
        $new_picture = $final_pics['fileField'];

		$stmt = $con -> prepare('UPDATE categories SET name=?, slug=?, picture=?, is_active=? WHERE id=?');
		$stmt -> bind_param('sssii', $category_name, $slug, $new_picture, $is_active, $id);
		$stmt -> execute();
		
		echo json_encode(['status' => 'success', 'message' => 'Item successfully updated.']);
        exit;
	}

	if($action === 'delete') {
		$id = $_POST['id'];
		$picture = $_POST['picture'] ?? '';

		$pictures = [
            $picture
        ];

        //Delete main images
        foreach ($pictures as $oldFileName) {
            if (!empty($oldFileName)) {
                // Delete old main image and thumbnail
                if (!empty($oldFileName)) {
                    $path = "../../site_img/categories/$oldFileName";
                    if (file_exists($path)) @unlink($path);
                }
            } 
        }

		$stmt = $con -> prepare('DELETE FROM categories WHERE id = ?');
		$stmt -> bind_param('i', $id);
		$stmt -> execute();

		echo json_encode(['status' => 'success', 'message' => 'Item successfully deleted.']);
        exit;
	}
}
?>