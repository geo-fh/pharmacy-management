<?php

include 'dbcreds.php';

if(isset($_POST["token"])) {
    $token = $_POST["token"];
    $dbquery = $con->query("SELECT
                                orders.order_id,
                                medication.medication_name,
                                order_medication.quantity,
                                order_medication.price
                            FROM
                                order_medication
                            JOIN orders ON order_medication.order_id = orders.order_id
                            JOIN medication ON medication.medication_id = order_medication.medication_id
                            JOIN patient ON patient.patient_id = orders.patient_id
                            JOIN session_tokens ON session_tokens.user_id = patient.user_id
                            WHERE session_tokens.token = '$token'");
} else if(isset($_POST["patient_id"])) {
    $patient_id = $_POST["patient_id"];
    $dbquery = $con->query("SELECT
                                orders.order_id,
                                medication.medication_name,
                                order_medication.quantity,
                                order_medication.price
                            FROM
                                order_medication
                            JOIN orders ON order_medication.order_id = orders.order_id
                            JOIN medication ON medication.medication_id = order_medication.medication_id
                            WHERE orders.patient_id = '$patient_id'");
} else {
    $dbquery = $con->query("SELECT order_medication.order_id, medication_name, quantity, order_medication.price FROM order_medication JOIN medication on order_medication.medication_id = medication.medication_id");   
}
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>