<?php

include "dbcreds.php";

if (
    isset($_POST["user_id"]) &&
    isset($_POST["first_name"]) &&
    isset($_POST["last_name"]) &&
    isset($_POST["mobile_number"]) &&
    isset($_POST["address"]) &&
    isset($_POST["date_of_birth"])
) {
    $user_id = $_POST["user_id"];
    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $mobile_number = $_POST["mobile_number"];
    $address = $_POST["address"];
    $date_of_birth = $_POST["date_of_birth"];

    $query = "INSERT INTO patient (patient_id, user_id, first_name, last_name, date_of_birth, address, mobile_number) VALUES (NULL, '$user_id', '$first_name', '$last_name', '$date_of_birth', '$address', '$mobile_number')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>