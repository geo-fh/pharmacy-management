<?php

include "dbcreds.php";

if (
    isset($_POST["email_address"]) &&
    isset($_POST["hash"])
) {
    $email_address = $_POST["email_address"];
    $hash = $_POST["hash"];

    $dbquery = $con->query("SELECT * FROM user WHERE email_address = '$email_address' && password = '$hash'");
    echo json_encode(mysqli_affected_rows($con));
    mysqli_close($con);
}

?>