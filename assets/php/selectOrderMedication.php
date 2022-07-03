<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT order_id, medication_name, quantity, order_medication.price FROM order_medication JOIN medication on order_medication.medication_id = medication.medication_id");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>