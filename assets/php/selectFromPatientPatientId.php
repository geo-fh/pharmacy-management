<?php

include "dbcreds.php";

if (
    isset($_POST["patient_id"])
) {
    $patient_id = $_POST["patient_id"];

    $dbquery = $con->query(
        "SELECT first_name, last_name, date_of_birth, address, mobile_number, email_address FROM patient JOIN user ON user.user_id = patient.user_id WHERE patient_id = '$patient_id'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);

?>