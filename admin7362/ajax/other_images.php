<?php include("../../api/config.php"); ?>
<?php 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $action = $_POST['action'] ?? '';
    if ($action === 'edit') {
        
        $id = $_POST['id'] ?? null;
        $file_name = $_POST['file_name'] ?? null;

        if ($id && !empty($_FILES["fileField"]["name"])) {
            if($file_name !== ""){
            $oldPath = "../../site_img/general/$file_name";
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
            }

            $random_id = substr(md5(rand()), 0, 10);
            $extension = pathinfo($_FILES["fileField"]["name"], PATHINFO_EXTENSION);
            $newFileName = "$random_id.$extension";
            $newPath = "../../site_img/general/$newFileName";

            if (move_uploaded_file($_FILES["fileField"]['tmp_name'], $newPath)) {

                $stmt = $con->prepare('UPDATE general_images SET size = ? WHERE id = ?');
                $stmt->bind_param('si', $newFileName, $id);
                $stmt->execute();

               echo json_encode(['status' => 'success', 'message' => 'Item sucessfully updated.']);
        exit;
            } else {
                echo json_encode(['status' => 'error', 'message' => 'File upload failed.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request parameters.']);
        }
    }
}
?>