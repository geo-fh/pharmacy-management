function validateLogin() {
  var xhttp = new XMLHttpRequest();
  var email = document.getElementById("InputEmail").value;
  var password = document.getElementById("InputPassword").value;
  var usertype;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      usertype = this.responseText;
      if(usertype != 1 && usertype != 2 && usertype != 3) {
        alert('Incorrect email or password.');
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