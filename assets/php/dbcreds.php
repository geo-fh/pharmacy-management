<?php

$con = mysqli_connect('localhost', 'pharmacy', '', 'pharmacy');

if(mysqli_connect_errno()) {
	die("Connection Error:".mysqli_connect_errno());
}

?>
