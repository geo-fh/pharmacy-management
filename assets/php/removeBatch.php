<?php

include "dbcreds.php";

if (isset($_POST["batch_id"])) {
    $batch_id = $_POST["batch_id"];

    $query = "DELETE FROM stock WHERE batch_id = '$batch_id'";
    if ($con->query($query) === true) {
		echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}

?>