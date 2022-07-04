<?php

include "dbcreds.php";

if (
    isset($_POST["user_id"]) &&
    isset($_POST["email_address"]) &&
    isset($_POST["password"]) &&
    isset($_POST["activated"]) &&
    isset($_POST["user_type"])
) {
    $user_id = $_POST["user_id"];
    $email_address = $_POST["email_address"];
    $password = $_POST["password"];
    $activated = $_POST["activated"];
    $user_type = $_POST["user_type"];
    if($password == "") {
        $query = "UPDATE user SET email_address = '$email_address' WHERE user_id = '$user_id'";
    } else {
        $query = "UPDATE user SET email_address = '$email_address', password = '$password' WHERE user_id = '$user_id'";
    }
    if($user_type == "1") {
        $query2 = "UPDATE pharmacist SET activated = '$activated' WHERE user_id = '$user_id'";
        if ($con->query($query) === true && $con->query($query2) === true) {
            echo json_encode("Success");
        } else {
            echo json_encode("Error");
        }
    } else {
        if ($con->query($query) === true) {
            echo json_encode("Success");
        } else {
            echo json_encode("Error");
        }
    }

    mysqli_close($con);
}

?>