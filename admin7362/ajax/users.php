<?php include("../../api/config.php");
header('Content-Type: application/json');

if(isset($_POST['user_id'])) {
    $user_id = mysqli_real_escape_string($con, $_POST['user_id']);

    // Begin transaction
    mysqli_begin_transaction($con);

    try {
        // Delete user's orders first
        $deleteOrders = $con->prepare("DELETE FROM orders WHERE user_id=?");
        $deleteOrders->bind_param("s", $user_id);
        $deleteOrders->execute();

        // Delete user
        $deleteUser = $con->prepare("DELETE FROM users WHERE user_id=?");
        $deleteUser->bind_param("s", $user_id);
        $deleteUser->execute();

        mysqli_commit($con);

        echo json_encode([
            "status" => "success",
            "message" => "User and their orders have been deleted successfully."
        ]);
    } catch (Exception $e) {
        mysqli_rollback($con);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to delete user. Please try again."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request."
    ]);
}
?>