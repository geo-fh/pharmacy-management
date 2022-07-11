<?php

include "dbcreds.php";

if(
    isset($_POST["token"]) &&
    isset($_POST["today"])
) 
    
{
    $token = $_POST["token"];
    $today = $_POST["today"];
    $dbquery = $con->query(
        "SELECT prescription_id, medication_id, quantity, used_quantity FROM prescription JOIN patient ON prescription.patient_id = patient.patient_id JOIN session_tokens ON session_tokens.user_id = patient.user_id WHERE session_tokens.token = '$token' AND end_date > '$today' ORDER BY prescription.end_date"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);

?>