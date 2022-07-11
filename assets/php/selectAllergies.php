<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT allergy_id, allergy_name FROM allergy");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>