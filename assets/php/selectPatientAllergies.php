<?php

include "dbcreds.php";

if(isset($_POST["token"])) {
    $token = $_POST["token"];
    $dbquery = $con->query(
        "SELECT allergy.allergy_id, allergy_name FROM patient_allergy JOIN patient ON patient_allergy.patient_id = patient.patient_id JOIN allergy ON allergy.allergy_id = patient_allergy.allergy_id JOIN session_tokens ON session_tokens.user_id = patient.user_id WHERE session_tokens.token = '$token'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

if(isset($_POST["patient_id"])) {
    $patient_id = $_POST["patient_id"];
    $dbquery = $con->query(
        "SELECT allergy.allergy_id, allergy_name FROM patient_allergy JOIN patient ON patient_allergy.patient_id = patient.patient_id JOIN allergy ON allergy.allergy_id = patient_allergy.allergy_id WHERE patient.patient_id = '$patient_id'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);

?>