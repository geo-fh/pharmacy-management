<?php

	include 'dbcreds.php';

	if(isset($_POST['email']) && isset($_POST['password'])) {
		$email = $_POST['email'];
		$password = $_POST['password'];
		$dbquery = $con->query("SELECT user_type FROM user WHERE email_address = '$email' AND password = '$password'");
		
		if(mysqli_affected_rows($con) > 0) {
			echo mysqli_fetch_row($dbquery)[0];
		} else {
			echo 'notfound';
		}
		mysqli_close($con);
	}
	
?>