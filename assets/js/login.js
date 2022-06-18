function validateLogin() {
  var xhttp = new XMLHttpRequest();
  var email = document.getElementById("InputEmail").value;
  var password = document.getElementById("InputPassword").value;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      switch(this.responseText) {
        case 'pharmacist':
          alert('pharmacist');
          break;
        case 'doctor':
          alert('doctor');
          break;
        case 'patient':
          alert('patient');
          break;
        default:
          alert('not a user');
      }
    }
  };
  xhttp.open("POST", "assets/php/login.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("email="+email+"&password="+password);
}

function saveSession(email, usertype) {

}