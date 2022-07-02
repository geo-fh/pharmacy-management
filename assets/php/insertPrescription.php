<?php

include "dbcreds.php";

if (
    isset($_POST["patient_id"]) &&
    isset($_POST["medication_id"]) &&
    isset($_POST["quantity"]) &&
    isset($_POST["start_date"]) &&
    isset($_POST["end_date"]) &&
    isset($_POST["usage_directions"])
) {
    $patient_id = $_POST["patient_id"];
    $medication_id = $_POST["medication_id"];
    $quantity = $_POST["quantity"];
    $start_date = $_POST["start_date"];
    $end_date = $_POST["end_date"];
    $usage_directions = $_POST["usage_directions"];

    $query = "INSERT INTO prescription (prescription_id, patient_id, medication_id, quantity, start_date, end_date, usage_directions) VALUES (NULL, '$patient_id', '$medication_id', '$quantity', '$start_date', '$end_date', '$usage_directions')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>