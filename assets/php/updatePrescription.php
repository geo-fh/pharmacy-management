<?php

include "dbcreds.php";

if(
    isset($_GET["quantity"]) &&
    isset($_GET["prescription_id"])
)
{
    $quantity = $_GET["quantity"];
    $prescription_id = $_GET["prescription_id"];
    $query = "UPDATE prescription SET used_quantity=used_quantity+'$quantity' WHERE prescription_id = '$prescription_id'";
    if ($con->query($query) === true) {
		echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
}

mysqli_close($con);

?>