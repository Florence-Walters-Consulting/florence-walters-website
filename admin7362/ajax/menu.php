<?php 
include("../../api/config.php"); 
$table_name = "menu";



if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $action = $_POST['action'] ?? '';
    $heading = trim($_POST['heading'] ?? '');
    $category = $_POST['category'] ?? '';
    $preamble = trim($_POST['preamble'] ?? '');
    $body = $_POST['body'] ?? '';
    $featured = $_POST['featured'] ?? '';
    $price = $_POST['price'] ?? '';
    
    $picture = $_POST['picture'] ?? '';
    $new_picture = '';

    $picture2 = $_POST['picture2'] ?? '';
    $new_picture2 = '';

    $picture3 = $_POST['picture3'] ?? '';
    $new_picture3 = '';
   
    $slug = makeSlug($heading);

    if (!empty($_FILES["fileField"]["name"])) {
        $random_id = bin2hex(random_bytes(5));
        $extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
        $upload_path = "../../site_img/$table_name/$random_id.$extension";

        if (move_uploaded_file($_FILES['fileField']['tmp_name'], $upload_path)) {
            $new_picture = "$random_id.$extension";
        }
    }

    if (!empty($_FILES["fileField2"]["name"])) {
        $random_id2 = bin2hex(random_bytes(5));
        $extension2 = pathinfo($_FILES["fileField2"]["name"], PATHINFO_EXTENSION);
        $upload_path2 = "../../site_img/$table_name/$random_id2.$extension2";

        if (move_uploaded_file($_FILES['fileField2']['tmp_name'], $upload_path2)) {
            $new_picture2 = "$random_id2.$extension2";
        }
    }

    if (!empty($_FILES["fileField3"]["name"])) {
        $random_id3 = bin2hex(random_bytes(5));
        $extension3 = pathinfo($_FILES["fileField3"]["name"], PATHINFO_EXTENSION);
        $upload_path3 = "../../site_img/$table_name/$random_id3.$extension3";

        if (move_uploaded_file($_FILES['fileField3']['tmp_name'], $upload_path3)) {
            $new_picture3 = "$random_id3.$extension3";
        }
    }

    if ($action === 'save') {
        $menu_id = bin2hex(random_bytes(5));
        $final_picture = $new_picture ?: '';
        $final_picture2 = $new_picture2 ?: '';
        $final_picture3 = $new_picture3 ?: '';

        $stmt = $con->prepare("INSERT INTO $table_name (uniqueId, categoryId, heading, slug, preamble, body, price, featured, picture, picture2, picture3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('sssssssssss', $menu_id, $category, $heading, $slug, $preamble, $body, $price, $featured, $final_picture, $final_picture2, $final_picture3);
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
        //$old_images = extract_image_sources($oldBody);
        //$new_images = extract_image_sources($body);

        // Delete images that were removed in the updated content
       // $deleted_images = array_diff($old_images, $new_images);
      /*  foreach ($deleted_images as $imgPath) {
            if (file_exists($imgPath)) unlink($imgPath);
        }
            */

        // Replace featured image if a new one was uploaded
        $final_picture = $new_picture ?: $picture;
        if ($new_picture && !empty($picture)) {
            @unlink("../../site_img/$table_name/$picture");
        }

        $final_picture2 = $new_picture2 ?: $picture2;
        if ($new_picture2 && !empty($picture2)) {
            @unlink("../../site_img/$table_name/$picture2");
        }

        $final_picture3 = $new_picture3 ?: $picture3;
        if ($new_picture3 && !empty($picture3)) {
            @unlink("../../site_img/$table_name/$picture3");
        }

        $stmt = $con->prepare("UPDATE $table_name SET categoryId = ?, heading = ?, slug = ?, preamble = ?, body = ?, price = ?, featured = ?, picture = ?, picture2 = ?, picture3 = ? WHERE id = ?");
        $stmt->bind_param('ssssssssssi', $category, $heading, $slug, $preamble, $body, $price, $featured, $final_picture, $final_picture2, $final_picture3, $id);
        $stmt->execute();
        echo "Menu successfully updated.";
    }

    if ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $picture = $_POST['picture'] ?? '';
        $picture2 = $_POST['picture2'] ?? '';
        $picture3 = $_POST['picture3'] ?? '';

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
        if (!empty($picture2)) {
            @unlink("../../site_img/$table_name/$picture2");
        }
        if (!empty($picture3)) {
            @unlink("../../site_img/$table_name/$picture3");
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