var xhttp = new XMLHttpRequest();
var patientid = 1;
xhttp.onreadystatechange = function() {
if (this.readyState == 4 && this.status == 200) {
    var info = JSON.parse(this.responseText);
    document.getElementById("first_name").value = info[0].first_name;
    document.getElementById("last_name").value = info[0].last_name;
    document.getElementById("email").value = info[0].email_address;
    document.getElementById("mobile").value = info[0].mobile_number;
    document.getElementById("birthdate").value = info[0].date_of_birth;
    document.getElementById("city").value = 'Beirut';
    document.getElementById("address").value = info[0].address;
    document.getElementById("nav_name").innerText = info[0].first_name + ' ' + info[0].last_name;

}
};
xhttp.open("POST", "assets/php/selectFromPatient.php", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send("patientid="+patientid);