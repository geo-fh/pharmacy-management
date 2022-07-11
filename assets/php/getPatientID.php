<?php

include "dbcreds.php";

if (isset($_POST["token"])) {
    $token = $_POST["token"];

    $dbquery = $con->query(
        "SELECT patient_id FROM session_tokens JOIN patient ON session_tokens.user_id = patient.user_id WHERE token = '$token'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
    mysqli_close($con);
}

?>