<?php 
include("../../api/config.php"); 
$table_name = "blog";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $action = $_POST['action'] ?? '';
    $heading = trim($_POST['heading'] ?? '');
    $category = $_POST['category'] ?? '';
    $preamble = trim($_POST['preamble'] ?? '');
    $body = $_POST['body'] ?? '';
    $featured = $_POST['featured'] ?? '';
    $comments_allowed = $_POST['comments_allowed'] ?? '';
    $date = $_POST['date'] ?? date('Y-m-d H:i:s');
    $keywords = "$heading $preamble $body";
    $slug = makeSlug($heading);

    if ($action === 'save') {
        $blog_id = bin2hex(random_bytes(5));
        $new_picture = '';
        $new_picture = uploadImage("fileField","$table_name", 800, 600);

        $stmt = $con->prepare("INSERT INTO $table_name (blog_id, heading, slug, category, preamble, body, picture, featured, date, keywords, comments_allowed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param('sssssssssss', $blog_id, $heading, $slug, $category, $preamble, $body, $new_picture, $featured, $date, $keywords, $comments_allowed);
        $stmt->execute();
        
        echo json_encode(['status' => 'success', 'message' => 'Item sucessfully added.']);
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

        $picture = $_POST['picture'] ?? '';
        $current_pics = [
            'fileField'  => $picture
        ];

        $final_pics = [];
        foreach ($current_pics as $field => $oldFileName) {
            if (!empty($_FILES[$field]["name"])) {
                // Delete old main image and thumbnail
                if (!empty($oldFileName)) {
                    $path = "../../site_img/$table_name/$oldFileName";
                    if (file_exists($path)) @unlink($path);
                }
                
                $final_pics[$field] = uploadImage($field, "$table_name", 800, 600);
            } else {
                // No new file, keep existing
                $final_pics[$field] = $oldFileName;
            }
        }

        $new_picture = $final_pics['fileField'];

        $stmt = $con->prepare("UPDATE $table_name SET heading = ?, slug = ?, category = ?, preamble = ?, body = ?, picture = ?, featured = ?, date = ?, keywords = ?, comments_allowed = ? WHERE id = ?");
        $stmt->bind_param('ssssssssssi', $heading, $slug, $category, $preamble, $body, $new_picture, $featured, $date, $keywords, $comments_allowed, $id);
        $stmt->execute();
       
        echo json_encode(['status' => 'success', 'message' => 'Item successfully updated.']);
        exit;
    }

    if ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);
        $picture = $_POST['picture'] ?? '';

        $pictures = [
            $picture
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
        $result = $con->query("SELECT body FROM $table_name WHERE id = $id");
        if ($row = $result->fetch_assoc()) {
            $embedded_images = extract_image_sources($row['body']);
            foreach ($embedded_images as $imgPath) {
                if (file_exists($imgPath)) unlink($imgPath);
            }
        }

        // Delete record from DB
        $stmt = $con->prepare("DELETE FROM $table_name WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'message' => 'Item deleted successfully.']);
        exit;
    }
}
?>