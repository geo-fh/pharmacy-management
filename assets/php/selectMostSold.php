<?php

include 'dbcreds.php';

if(
    isset($_POST["start_date"]) &&
    isset($_POST["end_date"]))
{
    $start_date = $_POST["start_date"];
    $end_date = $_POST["end_date"];
    
    $dbquery = $con->query("SELECT medication_name, SUM(order_medication.quantity) AS quan FROM order_medication JOIN medication ON order_medication.medication_id = medication.medication_id JOIN orders ON order_medication.order_id = orders.order_id WHERE orders.cancel_date IS NULL AND orders.purchase_date >= '$start_date' AND orders.purchase_date <= '$end_date' GROUP BY order_medication.medication_id ORDER BY quan DESC");

    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);
	
?>