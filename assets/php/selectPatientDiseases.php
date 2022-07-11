<?php

include "dbcreds.php";

if(isset($_POST["token"])) {
    $token = $_POST["token"];
    $dbquery = $con->query(
        "SELECT disease.disease_id, disease_name FROM patient_disease JOIN patient ON patient_disease.patient_id = patient.patient_id JOIN disease ON disease.disease_id = patient_disease.disease_id JOIN session_tokens ON session_tokens.user_id = patient.user_id WHERE session_tokens.token = '$token'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

if(isset($_POST["patient_id"])) {
    $patient_id = $_POST["patient_id"];
    $dbquery = $con->query(
        "SELECT disease.disease_id, disease_name FROM patient_disease JOIN patient ON patient_disease.patient_id = patient.patient_id JOIN disease ON disease.disease_id = patient_disease.disease_id WHERE patient.patient_id = '$patient_id'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);

?>