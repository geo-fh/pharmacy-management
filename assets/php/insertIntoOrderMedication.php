<?php

include "dbcreds.php";

if (
    isset($_POST["order_id"]) &&
    isset($_POST["medication_id"]) &&
    isset($_POST["quantity"]) &&
    isset($_POST["price"])
) {
    $order_id = $_POST["order_id"];
    $medication_id = $_POST["medication_id"];
    $quantity = $_POST["quantity"];
    $price = $_POST["price"];

    $query = "INSERT INTO order_medication (order_id, medication_id, quantity, price) VALUES ('$order_id', '$medication_id', '$quantity', '$price')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>