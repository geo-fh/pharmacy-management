var allergyList, diseaseList;
var patientAllergies, patientDiseases;

$(function () {
    getUserInfo();
    fetchAandD();
    fetchpAandpD();
    setEvents();
})

function setEvents() {
    $(document).on("click", "#updateProfile", function () {
        if (!validateMobile($("#mobile").val().replaceAll(" ", "")))
            failureToast("Mobile number not valid")
        else
            updateUserInfo();
    })

    $(document).on("click", "#updateLogin", function () {
        hash($("#oldPassword").val()).then(hash => {
            var details = {
                'email_address': $("#email").val(),
                'hash': hash
            };
            postData("assets/php/checkPassword.php", prepareData(details))
                .then(data => {
                    if (data == 0) {
                        failureToast("Old Password is incorrect");
                        return;
                    } else if (data == 1) {
                        updatePassword();
                    }
                });
        })
    })

    $(document).on("click", ".btn-closeA", function () {
        var allergy_id = this.id.substring(13);
        removeAllergy(allergy_id);
    })

    $(document).on("click", ".btn-closeD", function () {
        var disease_id = this.id.substring(13);
        removeDisease(disease_id);
    })

    $(document).on("click", "#addpAllergy", function () {
        var allergy_id = $("#allergySearch option:selected").val();
        addpAllergy(allergy_id);
    })

    $(document).on("click", "#addpDisease", function () {
        var disease_id = $("#diseaseSearch option:selected").val();
        addpDisease(disease_id);
    })

    $("#allergySearch").select2();
    $("#diseaseSearch").select2();
}

function getUserInfo() {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/verifyToken.php", prepareData(details))
        .then(user_data => {
            var details = {
                'token': getCookie("sessionToken"),
                'user_type': user_data[0].user_type
            };
            postData("assets/php/selectFromPatient.php", prepareData(details))
                .then(data => {
                    fillUserInfo(data, user_data[0].user_type)
                });
        });
}

function fillUserInfo(data, user_type) {
    $("#first_name").val(data[0].first_name);
    $("#last_name").val(data[0].last_name);
    $("#email").val(data[0].email_address);
    $("#mobile").val(data[0].mobile_number.substring(5));
    if (user_type == 3) {
        $("#accountDate").val(data[0].date_of_birth);
        $("#address").val(data[0].address);
    } else if (user_type == 1 || user_type == 2) {
        $("#dateTitle").text("Start of Work Date")
        $("#accountDate").val(data[0].start_of_work_date);
        $("#accountDate").prop("disabled", true)
        $("#address").val(data[0].address);
        $("#addressRow").remove();
    }
}

function updateUserInfo() {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/verifyToken.php", prepareData(details))
        .then(data => {
            updateInfo(data[0].user_id, data[0].user_type)
        });
}

function updatePassword() {
    if($("#newPassword").val() == $("#repeatNewPassword").val() && $("#newPassword").val().length >= 8) {
        hash($("#newPassword").val()).then(hash => {
            var details = {
                'email_address': $("#email").val(),
                'hash': hash
            };
            postData("assets/php/editPassword.php", prepareData(details))
                .then(data => {
                    if (data != "Error") {
                        successToast("Password updated")
                        setTimeout(function(){
                            window.location.reload();
                        }, 2000);
                    } else {
                        failureToast("Error")
                    }
                });
        })
    } else if($("#newPassword").val() != $("#repeatNewPassword").val()) {
        failureToast("Passwords do not match")
    } else if($("#newPassword").val().length < 8) {
        failureToast("New password needs to be 8 characters or longer")
    }
}

function updateInfo(user_id, user_type) {
    if (user_type == 3) {
        var details = {
            'user_type': user_type,
            'user_id': user_id,
            'first_name': $("#first_name").val(),
            'last_name': $("#last_name").val(),
            'mobile_number': codifyCountry($("#mobile").val()),
            'date_of_birth': $("#accountDate").val(),
            'address': $("#address").val(),
        };
    } else {
        var details = {
            'user_type': user_type,
            'user_id': user_id,
            'first_name': $("#first_name").val(),
            'last_name': $("#last_name").val(),
            'mobile_number': codifyCountry($("#mobile").val())
        };
    }
    postData("assets/php/editUserInfo.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                successToast("Info updated");
                setTimeout(function(){
                    window.location.reload();
                }, 2000);
            }
        });
}

function fetchAandD() {
    postData("assets/php/selectAllergies.php", "")
        .then(data => {
            allergyList = data;
            populateAllergies();
        })

    postData("assets/php/selectDiseases.php", "")
        .then(data => {
            diseaseList = data;
            populateDiseases();
        })
}

function fetchpAandpD() {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/selectPatientAllergies.php", prepareData(details))
        .then(data => {
            patientAllergies = data;
            populatePatientAllergies();
        })

    postData("assets/php/selectPatientDiseases.php", prepareData(details))
        .then(data => {
            patientDiseases = data;
            populatePatientDiseases();
        })
}

function populateAllergies() {
    var r = new Array(), j = -1;
    r[++j] = "<option selected value=\"0\">Select an Allergy</option>";
    for (var i = 0; i < allergyList.length; i++) {
        r[++j] = "<option value=\"";
        r[++j] = allergyList[i].allergy_id;
        r[++j] = "\">";
        r[++j] = allergyList[i].allergy_name;
        r[++j] = "</option>";
    }
    $("#allergySearch").html(r.join(""));
}

function populateDiseases() {
    var r = new Array(), j = -1;
    r[++j] = "<option selected value=\"0\">Select a Disease</option>";
    for (var i = 0; i < diseaseList.length; i++) {
        r[++j] = "<option value=\"";
        r[++j] = diseaseList[i].disease_id;
        r[++j] = "\">";
        r[++j] = diseaseList[i].disease_name;
        r[++j] = "</option>";
    }
    $("#diseaseSearch").html(r.join(""));
}

function populatePatientAllergies() {
    var r = new Array(), j = -1;
    for (var i = 0; i < patientAllergies.length; i++) {
        r[++j] = "<div class=\"d-xxl-flex align-items-xxl-center\"><span class=\"text-center aanddlist\">";
        r[++j] = patientAllergies[i].allergy_name;
        r[++j] = "</span><button id=\"removeAllergy";
        r[++j] = patientAllergies[i].allergy_id;
        r[++j] = "\" class=\"btn-sm btn-close btn-closeA\" type=\"button\"></button></div>";
    }
    $("#patientAllergies").html(r.join(""));
}

function populatePatientDiseases() {
    var r = new Array(), j = -1;
    for (var i = 0; i < patientDiseases.length; i++) {
        r[++j] = "<div class=\"d-xxl-flex align-items-xxl-center\"><span class=\"text-center aanddlist\">";
        r[++j] = patientDiseases[i].disease_name;
        r[++j] = "</span><button id=\"removeDisease";
        r[++j] = patientDiseases[i].disease_id;
        r[++j] = "\" class=\"btn-sm btn-close btn-closeD\" type=\"button\"></button></div>";
    }
    $("#patientDiseases").html(r.join(""));
}

function removeAllergy(allergy_id) {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/getPatientID.php", prepareData(details))
        .then(patient_id => {
            var details = {
                'patient_id': patient_id[0].patient_id,
                'allergy_id': allergy_id
            };
            postData("assets/php/removeAllergy.php", prepareData(details))
                .then(data => {
                    if (data != "Error") {
                        fetchpAandpD();
                    }
                });
        });
}

function removeDisease(disease_id) {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/getPatientID.php", prepareData(details))
        .then(patient_id => {
            var details = {
                'patient_id': patient_id[0].patient_id,
                'disease_id': disease_id
            };
            postData("assets/php/removeDisease.php", prepareData(details))
                .then(data => {
                    if (data != "Error") {
                        fetchpAandpD();
                    }
                });
        });
}

function addpAllergy(allergy_id) {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/getPatientID.php", prepareData(details))
        .then(patient_id => {
            var details = {
                'patient_id': patient_id[0].patient_id,
                'allergy_id': allergy_id
            };
            postData("assets/php/insertPatientAllergy.php", prepareData(details))
                .then(data => {
                    if (data != "Error") {
                        fetchpAandpD();
                    }
                });
        });
}

function addpDisease(disease_id) {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/getPatientID.php", prepareData(details))
        .then(patient_id => {
            var details = {
                'patient_id': patient_id[0].patient_id,
                'disease_id': disease_id
            };
            postData("assets/php/insertPatientDisease.php", prepareData(details))
                .then(data => {
                    if (data != "Error") {
                        fetchpAandpD();
                    }
                });
        });
}