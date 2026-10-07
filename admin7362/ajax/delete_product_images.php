<?php $imageId = (int)$_POST['id'];

$stmt = $con->prepare("SELECT product_id, filename, is_primary FROM product_images WHERE id = ?");
$stmt->bind_param("i", $imageId);
$stmt->execute();
$stmt->bind_result($productId, $filename, $isPrimary);
if (!$stmt->fetch()) { exit("Image not found.");}
$stmt->close();

@unlink("../../site_img/products/" . $filename);
$thumb =
    str_replace(
        ".webp",
        "_thumb.webp",
        $filename
    );
@unlink("../../site_img/products/" . $thumb);

$stmt = $con->prepare("DELETE FROM product_images WHERE id = ?");
$stmt->bind_param("i", $imageId);
$stmt->execute();

if ($isPrimary == 1) {
    $stmt = $con->prepare("SELECT id FROM product_images WHERE product_id = ? ORDER BY sort_order LIMIT 1 ");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $stmt->bind_result($nextImage);
    if ($stmt->fetch()) {
        $stmt->close();
        $stmt = $con->prepare("UPDATE product_images SET is_primary = 1 WHERE id = ?");
        $stmt->bind_param("i",$nextImage);
        $stmt->execute();
    } else {
        $stmt->close();
    }
}