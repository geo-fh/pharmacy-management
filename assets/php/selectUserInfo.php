<?php

include 'dbcreds.php';

if(isset($_POST["user_id"])) {
    $user_id = $_POST["user_id"];

    $dbquery = $con->query("SELECT
                                user.user_id,
                                user_type,
                                1 AS activated,
                                email_address,
                                CONCAT(first_name, \" \", last_name) AS full_name
                            FROM
                                USER
                            JOIN patient ON USER.user_id = patient.user_id
                            WHERE
                                user.user_id = '$user_id'
                            UNION
                            SELECT
                                user.user_id,
                                user_type,
                                activated,
                                email_address,
                                CONCAT(first_name, \" \", last_name) AS full_name
                            FROM
                                USER
                            JOIN pharmacist ON USER.user_id = pharmacist.user_id
                            WHERE
                                user.user_id = '$user_id'
                            UNION
                            SELECT
                                user.user_id,
                                user_type,
                                1 AS activated,
                                email_address,
                                CONCAT(first_name, \" \", last_name) AS full_name
                            FROM
                                USER
                            JOIN admin ON USER.user_id = admin.user_id
                            WHERE
                                user.user_id = '$user_id'");
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
    mysqli_close($con);
}

	
?>