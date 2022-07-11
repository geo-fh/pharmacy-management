<?php

	include 'dbcreds.php';

	if(isset($_POST['email']) && isset($_POST['password'])) {
		$email = $_POST['email'];
		$password = $_POST['password'];
		$dbquery = $con->query("SELECT user_id, user_type FROM user WHERE email_address = '$email' AND password = '$password'");
		
		$result = mysqli_fetch_all($dbquery, MYSQLI_ASSOC);
		echo json_encode($result);
		mysqli_close($con);
	}
	
?>