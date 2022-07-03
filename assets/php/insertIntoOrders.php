<?php

include "dbcreds.php";

if (
    isset($_POST["patient_id"]) &&
    isset($_POST["purchase_date"]) &&
    isset($_POST["total_price"])
) {
    $patient_id = $_POST["patient_id"];
    $purchase_date = $_POST["purchase_date"];
    $total_price = $_POST["total_price"];

    $query = "INSERT INTO orders (order_id, patient_id, purchase_date, cancel_date, total_price) VALUES (NULL, '$patient_id', '$purchase_date', NULL, '$total_price')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>