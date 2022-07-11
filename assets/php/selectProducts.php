<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT medication_id, medication_name, active_ingredient, ingredients, contraindications, dosage, price, isOTC, units_per_package, leaflet FROM medication ORDER BY medication_name");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>