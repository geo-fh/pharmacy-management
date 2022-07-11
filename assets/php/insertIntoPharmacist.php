<?php

include "dbcreds.php";

if (
    isset($_POST["user_id"]) &&
    isset($_POST["first_name"]) &&
    isset($_POST["last_name"]) &&
    isset($_POST["mobile_number"]) &&
    isset($_POST["start_of_work_date"])
) {
    $user_id = $_POST["user_id"];
    $first_name = $_POST["first_name"];
    $last_name = $_POST["last_name"];
    $mobile_number = $_POST["mobile_number"];
    $start_of_work_date = $_POST["start_of_work_date"];

    $query = "INSERT INTO pharmacist (pharmacist_id, user_id, activated, first_name, last_name, mobile_number, start_of_work_date, end_of_work_date) VALUES (NULL, '$user_id', 0, '$first_name', '$last_name', '$mobile_number', '$start_of_work_date', NULL)";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>