<?php
require_once __DIR__ . '/helpers/config.php';

$isLoopbackAddress = static function (string $address): bool {
    if ($address === '::1') {
        return true;
    }

    return filter_var($address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)
        && str_starts_with($address, '127.');
};

$environment = strtolower(trim(envValue('APP_ENV', 'auto') ?? 'auto'));
$rawRequestHost = trim((string) ($_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? ''));
$parsedRequestHost = $rawRequestHost !== '' ? parse_url('http://' . $rawRequestHost, PHP_URL_HOST) : '';
$requestHost = strtolower(is_string($parsedRequestHost) ? trim($parsedRequestHost, '[]') : '');
$serverAddress = trim((string) ($_SERVER['SERVER_ADDR'] ?? ''));
$isLocalHost = in_array($requestHost, ['localhost', '127.0.0.1', '::1'], true)
    || str_ends_with($requestHost, '.localhost');
$automaticallyLocal = $isLocalHost && $isLoopbackAddress($serverAddress);

if (PHP_SAPI === 'cli' && $requestHost === '') {
    $automaticallyLocal = PHP_OS_FAMILY === 'Windows';
}

$dev = match ($environment) {
    'development', 'dev', 'local' => true,
    'production', 'prod' => false,
    default => $automaticallyLocal,
};

//variables
$company_name = "Florence Walters Consulting";
$url = "florencewaltersconsulting.com";
$no_reply_email = "noreply@$url";
$no_reply_password = "b*D6~EQXj1+K";
$company_email = "admin@$url";
$currency="&#8358;";
$admin_primary_color = "128, 0, 128";
$admin_secondary_color = "100, 100, 100";

// Database credentials
if ($dev) {
    $dbHost = "localhost";
    $dbName = "florencewalters";
    $dbUser = "root";
    $dbPassword = "";
} else {
    $dbHost = "localhost";
    $dbName = "florence_table";
    $dbUser = "florence_table";
    $dbPassword = "eieadjUE747ddHD";
}

$dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";

// PDO connection
$pdo = new PDO($dsn, $dbUser, $dbPassword, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

//mysqli connection
$con = mysqli_connect($dbHost, $dbUser, $dbPassword, $dbName);
$con->set_charset("utf8mb4");

// Check connection
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

//https
if (!$dev) {
    if(!isset($_SERVER["HTTPS"]) || $_SERVER["HTTPS"] != "on"){
        header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"], true, 301);
        exit;
    }
}

//functions
function makeSlug($string) {
    // Convert to lowercase
    $slug = strtolower($string);

    // Remove anything that's not a letter, number, or space
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);

    // Replace multiple spaces or hyphens with a single space
    $slug = preg_replace('/[\s-]+/', ' ', $slug);

    // Replace spaces with hyphens
    $slug = str_replace(' ', '-', $slug);

    // Trim hyphens from start and end
    $slug = trim($slug, '-');

    return $slug;
}

function formatFileSize($bytes) {
    if ($bytes >= 1048576) {
        return round($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return round($bytes / 1024, 2) . ' KB';
    } else {
        return $bytes . ' Bytes';
    }
}

function extract_image_sources($html) {
    if (empty(trim($html ?? ''))) {
        return [];
    }

    $dom = new DOMDocument();
    libxml_use_internal_errors(true);

    $dom->loadHTML($html);

    libxml_clear_errors();

    $image_paths = [];

    foreach ($dom->getElementsByTagName('img') as $img) {
        $src = $img->getAttribute('src');

        if (!empty($src) && strpos($src, "/site_img/") !== false) {
            $path = parse_url($src, PHP_URL_PATH);

            if ($path) {
                $image_paths[] = $_SERVER['DOCUMENT_ROOT'] . $path;
            }
        }
    }

    return $image_paths;
}

function createImageResource($tmpFile, $mime){
    switch ($mime) {
        case 'image/jpeg':
            return imagecreatefromjpeg($tmpFile);

        case 'image/png':
            return imagecreatefrompng($tmpFile);

        case 'image/webp':
            return imagecreatefromwebp($tmpFile);

        default:
            return false;
    }
}

function resizeImage($source, int $targetWidth, ?int $targetHeight = null){
    // Square if height not specified
    $targetHeight ??= $targetWidth;

    $sourceWidth = imagesx($source);
    $sourceHeight = imagesy($source);

    $sourceRatio = $sourceWidth / $sourceHeight;
    $targetRatio = $targetWidth / $targetHeight;

    // Determine crop dimensions
    if ($sourceRatio > $targetRatio) {

        // Source is wider than target
        $cropHeight = $sourceHeight;
        $cropWidth = (int) round($cropHeight * $targetRatio);

    } else {

        // Source is taller than target
        $cropWidth = $sourceWidth;
        $cropHeight = (int) round($cropWidth / $targetRatio);
    }

    // Center crop
    $srcX = (int) round(($sourceWidth - $cropWidth) / 2);
    $srcY = (int) round(($sourceHeight - $cropHeight) / 2);

    // Create destination image
    $resized = imagecreatetruecolor(
        $targetWidth,
        $targetHeight
    );

    // Preserve transparency
    imagealphablending($resized, false);
    imagesavealpha($resized, true);

    $transparent = imagecolorallocatealpha(
        $resized,
        0,
        0,
        0,
        127
    );

    imagefill(
        $resized,
        0,
        0,
        $transparent
    );

    imagecopyresampled(
        $resized,
        $source,
        0,
        0,
        $srcX,
        $srcY,
        $targetWidth,
        $targetHeight,
        $cropWidth,
        $cropHeight
    );

    return $resized;
}

function uploadImage($fileField, $table_name, int $chosenWidth, ?int $chosenHeight = null) {
    // Check if file was uploaded without errors
    if (!empty($_FILES[$fileField]["name"]) && $_FILES[$fileField]['error'] === UPLOAD_ERR_OK) {
        
        $tmpFile = $_FILES[$fileField]['tmp_name'];
        $mime = mime_content_type($tmpFile);
        
        // Validate image type
        if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'])) {
            error_log("Unsupported mime type: $mime for field $fileField");
            return "";
        }

        // Generate names
        $random_id = bin2hex(random_bytes(5));
        $fileName = $random_id . ".webp";
        
        $upload_path = "../../site_img/$table_name/$fileName";

        // Create image resource from temporary file
        $source = createImageResource($tmpFile, $mime);
        if (!$source) {
            return "";
        }

        // Resize the image
        $large = resizeImage($source, $chosenWidth, $chosenHeight);

        //Preserve transparency settings on the resized canvases before saving
        imagealphablending($large, false);
        imagesavealpha($large, true);

        // Compress and save as WebP
        $large_webp = imagewebp($large, $upload_path, 80);

        // Clean up memory resources immediately
        imagedestroy($source);
        if ($large !== $source) {
            imagedestroy($large);
        }

        //Return filename if the primary large image saved successfully
        if ($large_webp) {
            return $fileName;
        }
    }
    return "";
}