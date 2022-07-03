<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT orders.order_id, email_address, purchase_date, total_price FROM orders JOIN patient ON orders.patient_id = patient.patient_id JOIN user ON patient.user_id = user.user_id");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>