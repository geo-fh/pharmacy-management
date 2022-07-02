<?php

include "dbcreds.php";

if (isset($_POST["email"])) {
    $email = $_POST["email"];

    $dbquery = $con->query(
        "SELECT patient_id, email_address, first_name, last_name, mobile_number, date_of_birth FROM user JOIN patient ON user.user_id = patient.user_id WHERE user.email_address LIKE '%$email%'"
    );
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
    mysqli_close($con);
}

?>