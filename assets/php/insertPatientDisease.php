<?php

include "dbcreds.php";

if (
    isset($_POST["patient_id"]) &&
    isset($_POST["disease_id"])
) {
    $patient_id = $_POST["patient_id"];
    $disease_id = $_POST["disease_id"];

    $query = "INSERT INTO patient_disease (patient_id, disease_id) VALUES ('$patient_id', '$disease_id')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>