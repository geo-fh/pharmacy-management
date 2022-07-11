<?php

include 'dbcreds.php';

if(isset($_POST["otc"])) {
    if($_POST["otc"] == "no") {
        $dbquery = $con->query("SELECT medication_id, medication_name, price FROM medication WHERE isOTC = 'no'");
        $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
        echo json_encode($result);
    }
} else {
    $dbquery = $con->query("SELECT medication_id, medication_name, price FROM medication");
    $result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
    echo json_encode($result);
}

mysqli_close($con);
	
?>