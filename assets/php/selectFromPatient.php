<?php

include "dbcreds.php";

if (
    isset($_POST["token"]) &&
    isset($_POST["user_type"])
) {
    $token = $_POST["token"];
    $user_type = $_POST["user_type"];

    if($user_type == 1) {
        $dbquery = $con->query(
            "SELECT first_name, last_name, mobile_number, start_of_work_date, email_address FROM pharmacist JOIN session_tokens ON pharmacist.user_id = session_tokens.user_id JOIN user ON user.user_id = pharmacist.user_id WHERE token = '$token'"
        );
        $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
        echo json_encode($result);
    } else if($user_type == 2) {
        $dbquery = $con->query(
            "SELECT first_name, last_name, mobile_number, start_of_work_date, email_address FROM admin JOIN session_tokens ON admin.user_id = session_tokens.user_id JOIN user ON admin.user_id = admin.user_id WHERE token = '$token'"
        );
        $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
        echo json_encode($result);
    } else if($user_type == 3) {
        $dbquery = $con->query(
            "SELECT first_name, last_name, date_of_birth, address, mobile_number, email_address FROM patient JOIN session_tokens ON patient.user_id = session_tokens.user_id JOIN user ON user.user_id = patient.user_id WHERE token = '$token'"
        );
        $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
        echo json_encode($result);
    }
}

mysqli_close($con);

?>