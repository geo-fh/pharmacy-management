<?php

include 'dbcreds.php';

if(isset($_POST["order_id"])) {
    $order_id = $_POST["order_id"];

    $dbquery = $con->query("SELECT medication_name, quantity, order_medication.price FROM order_medication JOIN medication on order_medication.medication_id = medication.medication_id WHERE order_medication.order_id = '$order_id'");
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
    mysqli_close($con);
}

	
?>