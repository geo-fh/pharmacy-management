<?php

include 'dbcreds.php';

if(
    isset($_POST["start_date"]) &&
    isset($_POST["end_date"])
) {
    $start_date = $_POST["start_date"];
    $end_date = $_POST["end_date"];

    $dbquery = $con->query("SELECT status, COUNT(*) AS count FROM orders WHERE orders.purchase_date >= '$start_date' AND orders.purchase_date <= '$end_date' GROUP BY status");
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);

	
?>