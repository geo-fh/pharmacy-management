<?php

include "dbcreds.php";

if (
    isset($_POST["medication_id"]) &&
    isset($_POST["quantity"]) &&
    isset($_POST["expiration_date"])
) {
    $medication_id = $_POST["medication_id"];
    $quantity = $_POST["quantity"];
    $expiration_date = $_POST["expiration_date"];

    $query = "INSERT INTO stock (batch_id, medication_id, quantity, expiration_date) VALUES (NULL, '$medication_id', '$quantity', '$expiration_date')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>