<?php

include 'dbcreds.php';

$dbquery = $con->query("SELECT 
                            user.user_id,
                            user_type,
                            1 AS activated,
                            email_address,
                            CONCAT(first_name, \" \", last_name) AS full_name,
                            sign_up_date
                        FROM
                            USER
                        JOIN patient ON USER.user_id = patient.user_id
                        UNION
                        SELECT
                            USER.user_id,
                            user_type,
                            activated,
                            email_address,
                            CONCAT(first_name, \" \", last_name) AS full_name,
                            sign_up_date
                        FROM
                            USER
                        JOIN pharmacist ON USER.user_id = pharmacist.user_id
                        UNION
                        SELECT
                            USER.user_id,
                            user_type,
                            1 AS activated,
                            email_address,
                            CONCAT(first_name, \" \", last_name) AS full_name,
                            sign_up_date
                        FROM
                            USER
                        JOIN admin ON USER.user_id = admin.user_id
                        ORDER BY user_id");
$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
echo json_encode($result);
mysqli_close($con);
	
?>