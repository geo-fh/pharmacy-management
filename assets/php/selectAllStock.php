<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT batch_id, medication_name, quantity, expiration_date FROM stock JOIN medication on stock.medication_id = medication.medication_id ORDER BY batch_id");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>