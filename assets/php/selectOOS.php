<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT medication.medication_id, medication.medication_name, SUM(stock.quantity) AS quantity FROM stock RIGHT JOIN medication ON stock.medication_id = medication.medication_id GROUP BY medication.medication_id ORDER BY quantity LIMIT 5");

$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>