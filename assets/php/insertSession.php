<?php

include "dbcreds.php";

if (
    isset($_POST["user_id"]) &&
    isset($_POST["token"])
) {
    $user_id = $_POST["user_id"];
    $token = $_POST["token"];

    $query = "INSERT INTO session_tokens (session_id, user_id, token) VALUES (NULL, '$user_id', '$token')";
	if ($con->query($query) === true) {
		echo mysqli_insert_id($con);
    } else {
        echo json_encode("Error");
    }
    mysqli_close($con);
}
?>