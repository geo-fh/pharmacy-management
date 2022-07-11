<?php

include "dbcreds.php";

if (
    isset($_POST["patient_id"]) &&
    isset($_POST["allergy_id"])
) {
    $patient_id = $_POST["patient_id"];
    $allergy_id = $_POST["allergy_id"];

    $query = "INSERT INTO patient_allergy (patient_id, allergy_id) VALUES ('$patient_id', '$allergy_id')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>