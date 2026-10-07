<?php
include("../../api/config.php");
$table_name = "products";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $action = $_POST['action'] ?? '';
    $name = trim($_POST['name'] ?? '');
    $category_id = (int)($_POST['category_id'] ?? 0);
    $brand = trim($_POST['brand'] ?? '');
    $volume = trim($_POST['volume'] ?? '');
    $body = $_POST['body'] ?? '';
    $price = (float)($_POST['price'] ?? 0);
    $sale_price_input = trim($_POST['sale_price'] ?? '');
    $sale_price = $sale_price_input !== '' && (float)$sale_price_input > 0
        ? (float)$sale_price_input
        : null;
    $stock_quantity = (int)($_POST['stock_quantity'] ?? 0);
    $is_featured = (int)($_POST['is_featured'] ?? 0);
    $is_active = (int)($_POST['is_active'] ?? 1);
    $slug = makeSlug($name);
    $sku = bin2hex(random_bytes(5));
    $keywords = "$name $body";

    if ($action === 'save') {
        // initialize image vars to avoid undefined variables
        $new_picture1 = $new_picture2 = $new_picture3 = $new_picture4 = $new_picture5 = $new_picture6 = '';

        // Upload all images
        $new_picture1 = uploadImage("fileField","$table_name", 800);
        $new_picture2 = uploadImage("fileField2","$table_name", 800);
        $new_picture3 = uploadImage("fileField3","$table_name", 800);
        $new_picture4 = uploadImage("fileField4","$table_name", 800);
        $new_picture5 = uploadImage("fileField5","$table_name", 800);
        $new_picture6 = uploadImage("fileField6","$table_name", 800);

        // 1. Insert the product
        $stmt = $con->prepare(" INSERT INTO $table_name (
            name, slug, sku, category_id, body, price, sale_price, stock_quantity, volume, brand, is_active, is_featured, picture1, picture2, picture3, picture4, picture5, picture6, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param( "sssisddissiisssssss",
            $name,$slug,$sku,$category_id,$body,$price,$sale_price,
            $stock_quantity,$volume,$brand,$is_active,$is_featured,
            $new_picture1,$new_picture2,$new_picture3, $new_picture4,
            $new_picture5, $new_picture6,$keywords);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Product created successfully.']);
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

        $picture1 = $_POST['picture1'] ?? '';
        $picture2 = $_POST['picture2'] ?? '';
        $picture3 = $_POST['picture3'] ?? '';
        $picture4 = $_POST['picture4'] ?? '';
        $picture5 = $_POST['picture5'] ?? '';
        $picture6 = $_POST['picture6'] ?? '';

        //Map variables to an array for easy iteration
        $current_pics = [
            'fileField'  => $picture1,
            'fileField2' => $picture2,
            'fileField3' => $picture3,
            'fileField4' => $picture4,
            'fileField5' => $picture5,
            'fileField6' => $picture6
        ];

        //Process the 6 image fields dynamically
        $final_pics = [];
        foreach ($current_pics as $field => $oldFileName) {
            if (!empty($_FILES[$field]["name"])) {
                // Delete old main image and thumbnail
                if (!empty($oldFileName)) {
                    $path = "../../site_img/$table_name/$oldFileName";
                    if (file_exists($path)) @unlink($path);
                }
                // Use your compressed upload function
                $final_pics[$field] = uploadImage($field,"$table_name", 800);
            } else {
                // No new file, keep existing
                $final_pics[$field] = $oldFileName;
            }
        }

        $new_picture1 = $final_pics['fileField'];
        $new_picture2 = $final_pics['fileField2'];
        $new_picture3 = $final_pics['fileField3'];
        $new_picture4 = $final_pics['fileField4'];
        $new_picture5 = $final_pics['fileField5'];
        $new_picture6 = $final_pics['fileField6'];

        $stmt = $con->prepare("UPDATE $table_name SET name = ?, slug = ?, category_id = ?, body = ?, price = ?, sale_price = ?, stock_quantity = ?, volume = ?, brand = ?, is_active = ?, is_featured = ?, picture1 = ?, picture2 = ?, picture3 = ?, picture4 = ?, picture5 = ?, picture6 = ?, keywords = ? WHERE id = ?");
        $stmt->bind_param('ssisddissiisssssssi', $name, $slug, $category_id, $body, $price, $sale_price, $stock_quantity, $volume, $brand, $is_active, $is_featured, $new_picture1, $new_picture2, $new_picture3, $new_picture4, $new_picture5, $new_picture6, $keywords, $id);
        $stmt->execute();
        
        echo json_encode(['status' => 'success', 'message' => 'Product updated successfully.']);
        exit;
    }

    if ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $picture1 = $_POST['picture1'] ?? '';
        $picture2 = $_POST['picture2'] ?? '';
        $picture3 = $_POST['picture3'] ?? '';
        $picture4 = $_POST['picture4'] ?? '';
        $picture5 = $_POST['picture5'] ?? '';
        $picture6 = $_POST['picture6'] ?? '';

        //Map variables to an array for easy iteration
        $pictures = [
            $picture1,
            $picture2,
            $picture3,
            $picture4,
            $picture5,
            $picture6
        ];

        //Delete main images
        foreach ($pictures as $oldFileName) {
            if (!empty($oldFileName)) {
                // Delete old main image and thumbnail
                if (!empty($oldFileName)) {
                    $path = "../../site_img/$table_name/$oldFileName";
                    if (file_exists($path)) @unlink($path);
                }
            } 
        } 

        // Get body content to find and delete embedded images
        $stmt = $con->prepare("SELECT body FROM $table_name WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $embedded_images = extract_image_sources($row['body']);
            foreach ($embedded_images as $imgPath) {
                if (file_exists($imgPath)) {
                    @unlink($imgPath);
                }
            }
        }

        // Delete record from DB
        $stmt = $con->prepare("DELETE FROM $table_name WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'message' => 'Product deleted successfully.']);
        exit;
    }

    

}
