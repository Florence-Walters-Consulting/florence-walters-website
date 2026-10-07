<?php 
include("../../api/config.php"); 
$table_name = "testimonials";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $action = $_POST['action'] ?? '';
    $name = trim($_POST['name'] ?? '');
    $occupation = trim($_POST['occupation'] ?? '');
    $body = $_POST['body'] ?? '';
    $display = $_POST['display'] ?? '';
    $picture = $_POST['picture'] ?? '';
    $new_picture = '';

    if (!empty($_FILES["fileField"]["name"])) {
        $random_id = bin2hex(random_bytes(5));
        $extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
        $upload_path = "../../site_img/$table_name/$random_id.$extension";

        if (move_uploaded_file($_FILES['fileField']['tmp_name'], $upload_path)) {
            $new_picture = "$random_id.$extension";
        }
    }

    if ($action === 'save') {
        $unique_id = bin2hex(random_bytes(5));
        $final_picture = $new_picture ?: '';
        $auto_display = "Yes";
        $stmt = $con->prepare("INSERT INTO $table_name (name, occupation, body, picture, display) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sssss', $name, $occupation, $body, $final_picture, $auto_display);
        $stmt->execute();
        echo json_encode([
    			'status' => 'success',
    			'message' => 'Item successfully added.'
			]);
			exit;
    }

    if ($action === 'edit') {
        $id = (int)($_POST['id'] ?? 0);

        // Fetch old body content from DB
        $oldBody = '';
        $result = $con->query("SELECT body FROM $table_name WHERE id = $id");
        if ($row = $result->fetch_assoc()) {
            $oldBody = $row['body'];
        }

        // Get old and new image srcs
        $old_images = extract_image_sources($oldBody);
        $new_images = extract_image_sources($body);

        // Delete images that were removed in the updated content
        $deleted_images = array_diff($old_images, $new_images);
        foreach ($deleted_images as $imgPath) {
            if (file_exists($imgPath)) unlink($imgPath);
        }

        // Replace featured image if a new one was uploaded
        $final_picture = $new_picture ?: $picture;
        if ($new_picture && !empty($picture)) {
            @unlink("../../site_img/$table_name/$picture");
        }

        $stmt = $con->prepare("UPDATE $table_name SET name = ?, occupation = ?, body = ?, picture = ?, display = ? WHERE id = ?");
        $stmt->bind_param('sssssi', $name, $occupation, $body, $final_picture, $display, $id);
        $stmt->execute();
        echo json_encode([
    			'status' => 'success',
    			'message' => 'Item successfully updated.'
			]);
			exit;
    }

    if ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $picture = $_POST['picture'] ?? '';

        // Get body content to find and delete embedded images
        $result = $con->query("SELECT body FROM $table_name WHERE id = $id");
        if ($row = $result->fetch_assoc()) {
            $embedded_images = extract_image_sources($row['body']);
            foreach ($embedded_images as $imgPath) {
                if (file_exists($imgPath)) unlink($imgPath);
            }
        }

        // Delete featured image
        if (!empty($picture)) {
            @unlink("../../site_img/$table_name/$picture");
        }

        // Delete record from DB
        $stmt = $con->prepare("DELETE FROM $table_name WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        echo json_encode([
    			'status' => 'success',
    			'message' => 'Item successfully deleted.'
			]);
			exit;
    }
}
?>