var user_type, user_id;
$("#loginForm").on("submit", function (e) {
    e.preventDefault();
    hash($("#InputPassword").val()).then(data => {
        var details = {
            'email': $("#InputEmail").val(),
            'password': data
        };
        postData("assets/php/login.php", prepareData(details))
            .then(data => {
                if (data.length == 0) {
                    failureToast('Incorrect email or password.');
                    return;
                } else {
                    user_id = data[0].user_id;
                    user_type = data[0].user_type;
                    generateToken();
                }
            });
    })
})

function generateToken() {
    var string = new Date() + $("#InputEmail").val();
    hash(string).then(token => {
        var details = {
            'user_id': user_id,
            'token': token
        };
        postData("assets/php/insertSession.php", prepareData(details))
            .then(response => {
                if(response != "Error") {
                    saveSession(token);
                    if(user_type == "3") {
                        window.location.href = 'index';
                    } else {
                        window.location.href = 'dashboard';
                    }
                }
            });
    })
}