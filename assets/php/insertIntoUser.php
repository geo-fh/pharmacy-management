<?php

include "dbcreds.php";

if (
    isset($_POST["email_address"]) &&
    isset($_POST["password"]) &&
    isset($_POST["user_type"]) &&
    isset($_POST["sign_up_date"])
) {
    $email_address = $_POST["email_address"];
    $password = $_POST["password"];
    $user_type = $_POST["user_type"];
    $sign_up_date = $_POST["sign_up_date"];

    $query = "INSERT INTO user (user_id, email_address, password, user_type, sign_up_date) VALUES (NULL, '$email_address', '$password', '$user_type', '$sign_up_date')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>