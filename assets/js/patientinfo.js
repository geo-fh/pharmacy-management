var patientid = 1;
var details = {
    'patientid': patientid
  };
postData("assets/php/selectFromPatient.php", prepareData(details))
.then(data => {
    document.getElementById("first_name").value = data[0].first_name;
    document.getElementById("last_name").value = data[0].last_name;
    document.getElementById("email").value = data[0].email_address;
    document.getElementById("mobile").value = data[0].mobile_number;
    document.getElementById("birthdate").value = data[0].date_of_birth;
    document.getElementById("city").value = 'Beirut';
    document.getElementById("address").value = data[0].address;
});