<?php

include "dbcreds.php";

if (isset($_POST["patient_id"]) &&
    isset($_POST["allergy_id"]))
{
    $patient_id = $_POST["patient_id"];
    $allergy_id = $_POST["allergy_id"];

    $query = "DELETE FROM patient_allergy WHERE patient_id = '$patient_id' AND allergy_id = '$allergy_id'";
    if ($con->query($query) === true) {
		echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}

?>