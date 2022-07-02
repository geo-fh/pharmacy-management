$("#registerForm").on("submit", function (e) {
  e.preventDefault();
  var usertype;
  var details = {
    'email': document.getElementById("InputEmail").value,
    'password': document.getElementById("InputPassword").value
  };
  postData("assets/php/login.php", prepareData(details))
    .then(data => {
      if (data.length == 0) {
        alert('Incorrect email or password.');
        return;
      } else {
        usertype = data[0].user_type;
        console.log(usertype);
        saveSession(usertype);
      }
    });
})

function saveSession(email, usertype) {
  document.cookie = "usertype=" + usertype;
}