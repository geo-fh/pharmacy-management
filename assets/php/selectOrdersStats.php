<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT purchase_date, total_price FROM orders WHERE cancel_date IS NULL");

$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>