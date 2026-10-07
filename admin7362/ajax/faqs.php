<?php 
include("../../api/config.php"); 
$table_name = "faqs";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $action = $_POST['action'] ?? '';
    $question = $_POST['question'] ?? '';
    $body = $_POST['body'] ?? '';

    if ($action === 'save') {
        $stmt = $con->prepare("INSERT INTO $table_name (question, body) VALUES (?, ?)");
        $stmt->bind_param('ss', $question, $body);
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

        $stmt = $con->prepare("UPDATE $table_name SET question = ?, body = ? WHERE id = ?");
        $stmt->bind_param('ssi', $question, $body, $id);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'message' => 'Item sucessfully edited.']);
        exit;
    }

    if ($action === 'delete') {
        $id = (int)($_POST['id'] ?? 0);

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
        echo json_encode(['status' => 'success', 'message' => 'Item sucessfully deleted.']);
        exit;
    }
}
?>