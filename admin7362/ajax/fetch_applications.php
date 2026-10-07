<?php
require_once '../../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $position = trim($_POST['position'] ?? '');

    $query = "SELECT id, full_name, email, position, cv, date FROM applications";
    if ($position !== '') {
        $query .= " WHERE position = ?";
    }
    $query .= " ORDER BY id DESC";

    $stmt = $con->prepare($query);
    if ($position !== '') {
        $stmt->bind_param('s', $position);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $count = $result->num_rows;
    ob_start();
    while ($row = $result->fetch_assoc()) {
        $date_formatted = date("jS F, Y - g:i a", strtotime($row['date']));
         $id = $row['id'];
        $cv = $row['cv'];
        ?>
        <div class="mail-box">
            <div class="flex-grow-1 position-relative">
                <div class="mg-s-45">
                    <span class="f-s-13 text-primary"><?= htmlspecialchars($row['full_name']) ?></span> <br>
                    <span class="f-s-13 text-primary"><?= htmlspecialchars($row['email']) ?></span> <br>
                    <span class="f-s-13 text-primary"><?= htmlspecialchars($row['position']) ?></span> <br>
                    <span class="f-s-13 text-secondary"><?= $date_formatted ?></span> <br>
                    <a download href='../apply/cvs/<?= htmlspecialchars($row['cv']) ?>' class="f-s-13 text-primary">Download CV</a>
                </div>
            </div>
                <div>
        <div class="btn-grou dropdown-icon-none">
            <button aria-expanded="false"
                    class="btn border-0 icon-btn b-r-4 dropdown-toggle"
                    data-bs-auto-close="true" data-bs-toggle="dropdown"
                    type="button">
                <i class="fa-solid fa-gear"></i>
            </button>
            <ul class="dropdown-menu">

                <li class="delete-btn" data-cv='<?= $cv ?>' data-id="<?= $id ?>"><a class="dropdown-item" style='color:crimson;'><i class="fa-solid fa-trash"></i> Delete </a></li>
            </ul>
        </div>
    </div>
        </div>
        <?php
    }

    $html = ob_get_clean();
    if ($count === 0) {
        $html = "<p class='text-muted'>No applications found for that position.</p>";
    }

    echo json_encode([
        'count' => $count,
        'html' => $html
    ]);
}
