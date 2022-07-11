<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT disease_id, disease_name FROM disease");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>