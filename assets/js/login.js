function validateLogin() {
  var xhttp = new XMLHttpRequest();
  var email = document.getElementById("InputEmail").value;
  var password = document.getElementById("InputPassword").value;
  var usertype;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      switch(this.responseText) {
        case 'pharmacist':
          usertype = 1;
          break;
        case 'doctor':
          usertype = 2;
          break;
        case 'patient':
          usertype = 3;
          break;
        default:
          alert('Incorrect email or password');
          usertype = 0;
      }
      saveSession(email, usertype);
    }
  };
  xhttp.open("POST", "assets/php/login.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("email="+email+"&password="+password);
}

function saveSession(email, usertype) {
  document.cookie = "usertype=" + usertype;
  document.cookie = "email=" + email;
}