<?php

	include 'dbcreds.php';

	if(isset($_POST['email']) && isset($_POST['password'])) {
		$email = $_POST['email'];
		$password = $_POST['password'];
		$dbquery = $con->query("SELECT user_type FROM user WHERE email_address = '$email' AND password = '$password'");
		
		if(mysqli_affected_rows($con) > 0) {
			$result = mysqli_fetch_row($dbquery)[0];
			if($result == 1) {
				echo 'pharmacist';
			} else if($result == 2) {
				echo 'doctor';
			} else if($result == 3) {
				echo 'patient';
			}
		} else {
			echo 'notfound';
		}
		mysqli_close($con);
	}
	
?>