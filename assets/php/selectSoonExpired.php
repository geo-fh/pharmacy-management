<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT stock.batch_id, medication.medication_name, stock.quantity, stock.expiration_date FROM stock JOIN medication ON stock.medication_id = medication.medication_id ORDER BY stock.expiration_date LIMIT 5");

$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>