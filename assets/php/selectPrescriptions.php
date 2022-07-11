<?php

include "dbcreds.php";

if(isset($_POST["token"])) {
    $token = $_POST["token"];
    $dbquery = $con->query(
        "SELECT medication.medication_name, prescription.quantity, prescription.used_quantity, prescription.prescription_date, prescription.end_date, prescription.usage_directions FROM prescription JOIN medication ON medication.medication_id = prescription.medication_id JOIN patient ON prescription.patient_id = patient.patient_id JOIN session_tokens ON session_tokens.user_id = patient.user_id WHERE session_tokens.token = '$token'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

if(isset($_POST["patient_id"])) {
    $patient_id = $_POST["patient_id"];
    $dbquery = $con->query(
        "SELECT medication.medication_name, prescription.quantity, prescription.used_quantity, prescription.prescription_date, prescription.end_date, prescription.usage_directions FROM prescription JOIN medication ON prescription.medication_id = medication.medication_id WHERE patient_id = '$patient_id'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);

?>