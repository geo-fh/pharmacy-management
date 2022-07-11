<?php

include "dbcreds.php";

if (isset($_POST["token"])) {
    $token = $_POST["token"];

    $dbquery = $con->query("SELECT
                                USER.user_id,
                                user_type,
                                CONCAT(first_name, \" \", last_name) AS full_name
                            FROM
                                USER
                            JOIN patient ON USER.user_id = patient.user_id
                            JOIN session_tokens ON USER.user_id = session_tokens.user_id
                            WHERE
                                token = '$token'
                            UNION
                            SELECT
                                USER.user_id,
                                user_type,
                                CONCAT(first_name, \" \", last_name) AS full_name
                            FROM
                                USER
                            JOIN pharmacist ON USER.user_id = pharmacist.user_id
                            JOIN session_tokens ON USER.user_id = session_tokens.user_id
                            WHERE
                                token = '$token'
                            UNION
                            SELECT
                                USER.user_id,
                                user_type,
                                CONCAT(first_name, \" \", last_name) AS full_name
                            FROM
                                USER
                            JOIN admin ON USER.user_id = admin.user_id
                            JOIN session_tokens ON USER.user_id = session_tokens.user_id
                            WHERE
                                token = '$token'");

    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
    mysqli_close($con);
}
