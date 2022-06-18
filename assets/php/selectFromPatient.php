<?php

include "dbcreds.php";

if (isset($_POST["patientid"])) {
    $patientid = $_POST["patientid"];

    $dbquery = $con->query(
        "SELECT * FROM patient JOIN user on patient.user_id = user.user_id WHERE patient_id = '$patientid'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
    mysqli_close($con);
}

?>