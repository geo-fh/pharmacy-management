<?php

include "dbcreds.php";

if (isset($_POST["patient_id"]) &&
    isset($_POST["disease_id"]))
{
    $patient_id = $_POST["patient_id"];
    $disease_id = $_POST["disease_id"];

    $query = "DELETE FROM patient_disease WHERE patient_id = '$patient_id' AND disease_id = '$disease_id'";
    if ($con->query($query) === true) {
		echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}

?>