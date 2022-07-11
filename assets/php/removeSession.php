<?php

include "dbcreds.php";

if (isset($_POST["token"])) {
    $token = $_POST["token"];

    $query = "DELETE FROM session_tokens WHERE token = '$token'";
    if ($con->query($query) === true) {
		echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}

?>