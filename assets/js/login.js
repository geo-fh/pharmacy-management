$("#loginForm").on("submit", function (e) {
  e.preventDefault();
  var usertype;
  var details = {
    'email': $("#InputEmail").val(),
    'password': $("#InputPassword").val()
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

function successToast(text) {
  $("#toastSymbol").removeClass("fa-multiplication failure");
  $("#toastSymbol").addClass("fa-check success");
  $("#toastMessage1").removeClass("failure");
  $("#toastMessage1").addClass("success");
  $("#toastMessage1").text("Success");
  $("#toastMessage2").text(text);
}

function failureToast(text) {
  $("#toastSymbol").removeClass("fa-check success");
  $("#toastSymbol").addClass("fa-multiplication failure");
  $("#toastMessage1").removeClass("success");
  $("#toastMessage1").addClass("failure");
  $("#toastMessage1").text("Failure");
  $("#toastMessage2").text(text);
}