var patientAllergies, patientDiseases;

$(function () {
    fillUserInfo();
    fetchpAandpD();
    fetchPrescriptions();
})

function fillUserInfo() {
    var details = {
        'token': getCookie("sessionToken"),
        'user_type': 3
    };
    postData("assets/php/selectFromPatient.php", prepareData(details))
        .then(data => {
            $("#first_name").text(data[0].first_name);
            $("#last_name").text(data[0].last_name);
            $("#email").text(data[0].email_address);
            $("#mobile").text(data[0].mobile_number);
            $("#birthdate").text(getDate(new Date(data[0].date_of_birth)));
            $("#address").text(data[0].address);
        });
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

function fetchPrescriptions() {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/selectPrescriptions.php", prepareData(details))
        .then(data => {
            populatePrescriptions(data);
        })
}

function populatePatientAllergies() {
    var r = new Array(), j = -1;
    for (var i = 0; i < patientAllergies.length; i++) {
        r[++j] = "<div class=\"d-xxl-flex align-items-xxl-center\"><span class=\"text-center aanddlist\">";
        r[++j] = patientAllergies[i].allergy_name;
        r[++j] = "</span></div>";
    }
    if(patientAllergies.length != 0) {
        $("#patientAllergies").html(r.join(""));
    } else {
        $("#patientAllergies").html("None");
    }
}

function populatePatientDiseases() {
    var r = new Array(), j = -1;
    for (var i = 0; i < patientDiseases.length; i++) {
        r[++j] = "<div class=\"d-xxl-flex align-items-xxl-center\"><span class=\"text-center aanddlist\">";
        r[++j] = patientDiseases[i].disease_name;
        r[++j] = "</span></div>";
    }
    if(patientAllergies.length != 0) {
        $("#patientDiseases").html(r.join(""));
    } else {
        $("#patientDiseases").html("None");
    }
}

function populatePrescriptions(prescriptions) {
    var r = new Array(), j = -1;
    for (var i = 0; i < prescriptions.length; i++) {
        r[++j] = "<tr><td>";
        r[++j] = prescriptions[i].medication_name;
        r[++j] = "</td><td>";
        r[++j] = prescriptions[i].quantity;
        r[++j] = "</td><td>";
        r[++j] = prescriptions[i].used_quantity;
        r[++j] = "</td><td>";
        r[++j] = getDate(new Date(prescriptions[i].prescription_date));
        r[++j] = "</td><td>";
        r[++j] = getDate(new Date(prescriptions[i].end_date));
        r[++j] = "</td><td>";
        r[++j] = prescriptions[i].usage_directions;
        r[++j] = "</td></tr>";
    }
    if (prescriptions.length != 0) {
        $("#prescriptionTable").html(r.join(""));
    } else {
        $("#prescriptionTable").html("None");
    }
}