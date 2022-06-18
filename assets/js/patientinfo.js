var xhttp = new XMLHttpRequest();
var patientid = 1;
xhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
    alert(this.responseText);
}
};
xhttp.open("POST", "assets/php/selectFromPatient.php", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("patientid="+patientid);