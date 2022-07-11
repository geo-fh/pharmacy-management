<?php

include 'dbcreds.php';

if(isset($_POST["token"])) {
    $token = $_POST["token"];
    $dbquery = $con->query("SELECT order_id, purchase_date, cancel_date, total_price FROM orders JOIN patient ON orders.patient_id = patient.patient_id JOIN session_tokens ON session_tokens.user_id = patient.user_id WHERE session_tokens.token = '$token'");
} else if(isset($_POST["patient_id"])) {
    $patient_id = $_POST["patient_id"];
    $dbquery = $con->query("SELECT order_id, purchase_date, cancel_date, total_price FROM orders WHERE patient_id = '$patient_id'");
} else {
    $dbquery = $con->query("SELECT orders.order_id, email_address, purchase_date, total_price FROM orders JOIN patient ON orders.patient_id = patient.patient_id JOIN user ON patient.user_id = user.user_id");
}

$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>