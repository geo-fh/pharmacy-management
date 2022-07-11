var allergyList, diseaseList;
var selectedAllergies = [], selectedDiseases = [];
var progress = 0;
var finish;
var today = new Date();

$(function () {
    setEvents();
})

function setEvents() {
    $(document).on("click", "#nextButton", function () {
        handleNextButton();
    })

    $(document).on("click", "#submitRegister", function () {
        handleRegister();
    })

    $(document).on("focusout", ".form-control-user", function () {
        $(this).removeClass("fieldError");
        $(this).parent().removeClass("fieldError");
    })
}

function handleNextButton() {
    selectedAllergies = [];
    selectedDiseases = [];
    var errors = [];
    var firstName = $("#registerFirstName");
    var lastName = $("#registerLastName");
    var mobile = $("#registerMobile");
    var account_type = $("#account_type option:selected");
    var email = $("#registerEmail");
    var password1 = $("#registerPassword1");
    var password2 = $("#registerPassword2");

    postData("assets/php/checkEmailInUse.php", prepareData({ 'email_address': email.val() }))
        .then(data => {
            if (data > 0) {
                email.addClass("fieldError");
                failureToast("Email is already in use");
                return;
            } else {
                if (!validateName(firstName.val())) {
                    firstName.addClass("fieldError");
                    errors.push(0);
                }

                if (!validateName(lastName.val())) {
                    lastName.addClass("fieldError");
                    errors.push(1);
                }

                if (!validateMobile(mobile.val())) {
                    mobile.addClass("fieldError");
                    errors.push(2);
                }

                if (account_type.val() == "") {
                    account_type.parent().addClass("fieldError");
                    errors.push(3);
                }

                if (!validateEmail(email.val())) {
                    email.addClass("fieldError");
                    errors.push(4);
                }

                if (password1.val() == "" || password2.val() == "") {
                    password1.addClass("fieldError");
                    password2.addClass("fieldError");
                    errors.push(5);
                }

                if (password1.val() != password2.val()) {
                    errors[0] = "notmatch";
                    password1.addClass("fieldError");
                    password2.addClass("fieldError");
                }

                if (errors.length == 0) {
                    errors = [];
                    setUpSignUpModal(account_type.val());
                    $("#modal-1").modal('toggle');
                } else if (errors[0] == "notmatch" && errors.length == 1) {
                    failureToast("Passwords do not match")
                } else {
                    failureToast("Please fill in the fields correctly");
                }
            }

        });
}

function handleRegister() {
    var fail = false;
    var user_type;
    if ($("#account_type option:selected").val() == "Pharmacist") {
        user_type = 1;
        if ((new Date() - new Date($("#startDate").val())) < 0 || $("#startDate").val() == "") {
            fail = true;
            $("#startDate").addClass("fieldError");
            failureToast("Please select a valid date in the past")
        }
    } else if ($("#account_type option:selected").val() == "Patient") {
        user_type = 3;
        if ((new Date() - new Date($("#birthDate").val())) < 0 || $("#birthDate").val() == "") {
            $("#birthDate").addClass("fieldError");
            failureToast("Please select a valid date in the past")
            fail = true;
        }

        if ($("#registerAddress").val() == "") {
            $("#registerAddress").val().addClass("fieldError");
            failureToast("Please enter a valid address");
            fail = true;
        }
    }

    if (!fail) {
        hash($("#registerPassword1").val()).then(data => {
            insertUser(data, user_type);
        })
    }

}
function setUpSignUpModal(account_type) {
    var modalInner = "";
    var modalTitle = account_type + " Details";
    if (account_type == "Pharmacist") {
        modalInner = "<div class=\"row\" style=\"margin-bottom: 20px;\"><div class=\"col\"><span>Start of Work Date:</span></div><div class=\"col\"><input id=\"startDate\" type=\"date\"></div></div>";
        $("#modal1Body").html(modalInner);
    } else if (account_type == "Patient") {
        modalInner = "<form class=\"user\"><div class=\"row mb-3\"><div class=\"col-sm-8 offset-sm-2\"><input class=\"form-control form-control-user\" style=\"margin-bottom: 20px;\" type=\"text\" id=\"registerAddress\" placeholder=\"Address\" name=\"address\"></div></div><div class=\"row\"><div class=\"col\"><span>Birth Date:</span></div><div class=\"col\"><input id=\"birthDate\"></div></div></form><hr><div class=\"row\"><div class=\"col mb-3\"><div class=\"row\"><strong>Allergies</strong></div><div style=\"margin-bottom: 20px;\"><select id=\"allergySearch\" class=\"modalSelect\"></select><button id=\"addpAllergy\" class=\"btn btn-primary btn-sm text-center border rounded-circle\" type=\"button\" style=\"background: var(--bs-green);width: 30.3594px;font-weight: bold;border-color: var(--bs-green); margin-left: 10px;\" disabled>+</button></div><div id=\"patientAllergies\"></div></div></div><div id=\"signUpAllergies\" class=\"row\" style=\"margin-bottom: 20px;\"></div><hr><div class=\"row\" style=\"margin-bottom: 20px;\"><div class=\"col mb-3\"><div class=\"row\"><strong>Diseases</strong></div><div style=\"margin-bottom: 20px;\"><select id=\"diseaseSearch\" class=\"modalSelect\"></select><button id=\"addpDisease\" class=\"btn btn-primary btn-sm text-center border rounded-circle\" type=\"button\" style=\"background: var(--bs-green);width: 30.3594px;font-weight: bold;border-color: var(--bs-green); margin-left: 10px;\" disabled>+</button></div><div id=\"patientDiseases\"></div></div></div><div id=\"signUpDiseases\" class=\"row\"></div>";

        $("#modal1Body").html(modalInner);
        fetchAandD();
        setAandDButtons();
    }
    var maxDate = getDate(new Date((today.getDate() + "-" + (parseInt(today.getMonth() + 1) + "-" + (today.getFullYear() - 18)))));
    birthdate = $("#birthDate")
        .datepicker({
            maxDate: maxDate,
            changeMonth: true,
            dateFormat: 'dd-M-yy'
        })
    $("#modalTitle").html(modalTitle);
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

function populateAllergies() {
    var r = new Array(), j = -1;
    r[++j] = "<option value=\"0\" selected disabled>Select an Allergy</option>";
    for (var i = 0; i < allergyList.length; i++) {
        r[++j] = "<option value=\"";
        r[++j] = allergyList[i].allergy_id;
        r[++j] = "\">";
        r[++j] = allergyList[i].allergy_name;
        r[++j] = "</option>";
    }
    $("#allergySearch").html(r.join(""));
    $("#addpAllergy").prop("disabled", true);
    setDropdowns();
}

function populateDiseases() {
    var r = new Array(), j = -1;
    r[++j] = "<option value=\"0\" selected disabled>Select a Disease</option>";
    for (var i = 0; i < diseaseList.length; i++) {
        r[++j] = "<option value=\"";
        r[++j] = diseaseList[i].disease_id;
        r[++j] = "\">";
        r[++j] = diseaseList[i].disease_name;
        r[++j] = "</option>";
    }
    $("#diseaseSearch").html(r.join(""));
    $("#addpDisease").prop("disabled", true);
    setDropdowns();
}

function setDropdowns() {
    $("#diseaseSearch").select2({
        dropdownParent: $("#modal-1")
    });

    $("#allergySearch").select2({
        dropdownParent: $("#modal-1")
    });
}

function setAandDButtons() {
    $(document).on("click", ".btn-closeA", function (e) {
        e.stopImmediatePropagation();
        var allergy_id = this.id.substring(13);
        removeAllergy(allergy_id);
    })

    $(document).on("click", ".btn-closeD", function (e) {
        e.stopImmediatePropagation();
        var disease_id = this.id.substring(13);
        removeDisease(disease_id);
    })

    $(document).on("click", "#addpAllergy", function (e) {
        e.stopImmediatePropagation();
        var allergy_id = $("#allergySearch option:selected").val();
        addpAllergy(allergy_id);
    })

    $(document).on("click", "#addpDisease", function (e) {
        e.stopImmediatePropagation();
        var disease_id = $("#diseaseSearch option:selected").val();
        addpDisease(disease_id);
    })

    $(document).on("change", "#allergySearch", function (e) {
        e.stopImmediatePropagation();
        var allergy_id = $("#allergySearch option:selected").val();
        if (allergy_id == 0)
            $("#addpAllergy").prop("disabled", true);
        else
            $("#addpAllergy").prop("disabled", false);
    })

    $(document).on("change", "#diseaseSearch", function (e) {
        e.stopImmediatePropagation();
        var disease_id = $("#diseaseSearch option:selected").val();
        if (disease_id == 0)
            $("#addpDisease").prop("disabled", true);
        else
            $("#addpDisease").prop("disabled", false);
    })
}

function populatePatientAllergies() {
    var r = new Array(), j = -1;
    for (var i = 0; i < selectedAllergies.length; i++) {
        r[++j] = "<div class=\"row\"><div class=\"col\"><span class=\"text-center aanddlist\">";
        r[++j] = allergyList[selectedAllergies[i] - 1].allergy_name;
        r[++j] = "</span><button id=\"removeAllergy";
        r[++j] = allergyList[selectedAllergies[i] - 1].allergy_id;
        r[++j] = "\" class=\"btn-sm btn-close btn-closeA\" type=\"button\"></button></div></div>";
    }
    $("#patientAllergies").html(r.join(""));
}

function populatePatientDiseases() {
    var r = new Array(), j = -1;
    for (var i = 0; i < selectedDiseases.length; i++) {
        r[++j] = "<div class=\"row\"><div class=\"col\"><span class=\"text-center aanddlist\">";
        r[++j] = diseaseList[selectedDiseases[i] - 1].disease_name;
        r[++j] = "</span><button id=\"removeDisease";
        r[++j] = diseaseList[selectedDiseases[i] - 1].disease_id;
        r[++j] = "\" class=\"btn-sm btn-close btn-closeD\" type=\"button\"></button></div></div>";
    }
    $("#patientDiseases").html(r.join(""));
}

function removeAllergy(allergy_id) {
    var index = selectedAllergies.indexOf(allergy_id);
    if (index != -1) {
        selectedAllergies.splice(index, 1);
        populatePatientAllergies();
    }
}

function removeDisease(disease_id) {
    var index = selectedDiseases.indexOf(disease_id);
    if (index != -1) {
        selectedDiseases.splice(index, 1);
        populatePatientDiseases();
    }
}

function addpAllergy(allergy_id) {
    var index = selectedAllergies.indexOf(allergy_id);
    if (index == -1 && allergy_id > 0) {
        selectedAllergies.push(allergy_id);
        populateAllergies();
        populatePatientAllergies();
    }
}

function addpDisease(disease_id) {
    var index = selectedDiseases.indexOf(disease_id);
    if (index == -1 && disease_id > 0) {
        selectedDiseases.push(disease_id);
        populateDiseases();
        populatePatientDiseases();
    }
}

function insertUser(password, user_type) {
    var details = {
        'email_address': $("#registerEmail").val(),
        'password': password,
        'user_type': user_type,
        'sign_up_date': new Date().toISOString().substring(0, 10)
    };
    postData("assets/php/insertIntoUser.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                if (user_type == 1)
                    insertPharmacist(data);
                else if (user_type == 3)
                    insertPatient(data);
            }
        });
}

function insertPharmacist(user_id) {
    var details = {
        'user_id': user_id,
        'first_name': $("#registerFirstName").val(),
        'last_name': $("#registerLastName").val(),
        'mobile_number': codifyCountry($("#registerMobile").val()),
        'start_of_work_date': new Date($("#startDate").val()).toISOString().substring(0, 10)
    };
    postData("assets/php/insertIntoPharmacist.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                generateToken(user_id, 1);
            }
        });
}

function insertPatient(user_id) {
    var details = {
        'user_id': user_id,
        'first_name': $("#registerFirstName").val(),
        'last_name': $("#registerLastName").val(),
        'mobile_number': codifyCountry($("#registerMobile").val()),
        'address': $("#registerAddress").val(),
        'date_of_birth': new Date($("#birthDate").val()).toISOString().substring(0, 10)
    };
    postData("assets/php/insertIntoPatient.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                finish = selectedAllergies.length + selectedDiseases.length;
                for (var i = 0; i < selectedAllergies.length; i++)
                    insertAllergy(user_id, data, selectedAllergies[i]);
                for (var i = 0; i < selectedDiseases.length; i++)
                    insertDisease(user_id, data, selectedDiseases[i]);
            }
        }).then();
}

function generateToken(user_id, user_type) {
    var string = new Date() + $("#InputEmail").val();
    hash(string).then(token => {
        var details = {
            'user_id': user_id,
            'token': token
        };
        postData("assets/php/insertSession.php", prepareData(details))
            .then(response => {
                if (response != "Error") {
                    saveSession(token);
                    if (user_type == "3") {
                        window.location.href = 'index';
                    } else {
                        window.location.href = 'dashboard';
                    }
                }
            });
    })
}

function insertAllergy(user_id, patient_id, allergy_id) {
    var details = {
        'patient_id': patient_id,
        'allergy_id': allergy_id
    };
    postData("assets/php/insertPatientAllergy.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                progress++;
                if (progress == finish)
                    generateToken(user_id, 3);
            }
        });
}

function insertDisease(user_id, patient_id, disease_id) {
    var details = {
        'patient_id': patient_id,
        'disease_id': disease_id
    };
    postData("assets/php/insertPatientDisease.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                progress++;
                if (progress == finish)
                    generateToken(user_id, 3);
            }
        });
}