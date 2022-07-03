<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT medication_id, medication_name, price FROM medication");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>