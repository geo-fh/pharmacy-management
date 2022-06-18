var xhttp = new XMLHttpRequest();
var patientid = 1;
xhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
    var info = JSON.parse(this.responseText);
    var infolist = 'patient_id: ' + info[0].patient_id + '\nuser_id: ' + info[0].user_id + '\nname: ' + info[0].first_name + ' ' + info[0].last_name + '\nbirthdate: ' + info[0].date_of_birth + '\naddress: ' + info[0].address + '\nmobile_number: ' + info[0].mobile_number;
    alert(infolist);
}
};
xhttp.open("POST", "assets/php/selectFromPatient.php", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("patientid="+patientid);