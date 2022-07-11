<?php

include "dbcreds.php";

if(isset($_POST["user_type"])) {
    $user_type = $_POST["user_type"];
    $user_id = $_POST["user_id"];
    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $mobile_number = $_POST["mobile_number"];

    if($user_type == 1) {
        $query = "UPDATE pharmacist SET first_name = '$first_name', last_name = '$last_name', mobile_number = '$mobile_number' WHERE user_id = '$user_id'";
    } else if($user_type == 2) {
        $query = "UPDATE admin SET first_name = '$first_name', last_name = '$last_name', mobile_number = '$mobile_number' WHERE user_id = '$user_id'";
    } else if($user_type == 3) {
        $date_of_birth = $_POST["date_of_birth"];
        $address = $_POST["address"];
        $query = "UPDATE patient SET first_name = '$first_name', last_name = '$last_name', mobile_number = '$mobile_number', date_of_birth = '$date_of_birth', address = '$address' WHERE user_id = '$user_id'";
    }

    if ($con->query($query) === true) {
        echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
}

mysqli_close($con);
