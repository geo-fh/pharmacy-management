<?php

include "dbcreds.php";

if (
    isset($_POST["email_address"])
) {
    $email_address = $_POST["email_address"];

    $dbquery = $con->query("SELECT * FROM user WHERE email_address = '$email_address'");
    echo json_encode(mysqli_affected_rows($con));
    mysqli_close($con);
}

?>