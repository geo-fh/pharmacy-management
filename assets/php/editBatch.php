<?php

include "dbcreds.php";

if (
    isset($_POST["batch_id"]) &&
    isset($_POST["quantity"]) &&
    isset($_POST["expiration_date"])
) {
    $batch_id = $_POST["batch_id"];
    $quantity = $_POST["quantity"];
    $expiration_date = $_POST["expiration_date"];

    $query = "UPDATE stock SET quantity = '$quantity', expiration_date = '$expiration_date' WHERE batch_id = '$batch_id'";
    if ($con->query($query) === true) {
		echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}

?>