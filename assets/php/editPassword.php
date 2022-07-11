<?php

include "dbcreds.php";

if (
    isset($_POST["hash"]) &&
    isset($_POST["email_address"])
) {
    $hash = $_POST["hash"];
    $email_address = $_POST["email_address"];

    $query = "UPDATE user SET password = '$hash' WHERE email_address = '$email_address'";
    
    if ($con->query($query) === true) {
        echo json_encode("Success");
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}

?>