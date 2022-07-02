var patientEmails;
var selectedPatient = -1;
var medicationList;
var transactionCart;

$(function () {
    setEvents();
    fetchMedicationList();
})

function setEvents() {
    $(document).on("click", "#inputEmailButton", function () {
        fetchPatientEmails();
    })

    $(document).on("change", "#patientEmails", function () {
        selectedPatient = this.selectedIndex-1;
        fillInfo();
    })

    $("#medSearch").select2({
        dropdownParent: $("#modal-1")
    });

    $(document).on("click", "#addPresBtn", function () {
        var medication_id = $("option:selected", "#medSearch")[0].value
        var quantity = $("#presQuantity").val();
        var start_date = $("#presStart").val();
        var end_date = $("#presEnd").val();
        var usage_directions = $("#usageDirections").val();
        if(new Date(end_date) - new Date(start_date) > 0)
            insertPrescription(medication_id, quantity, start_date, end_date, usage_directions);
    })

    $(document).on("click", "#cancelPresBtn", function () {
        clearModal1();
    })
}

function fetchPatientEmails() {
    var email = $("#inputEmail").val();
    if(email != "") {
        var details = {
            'email': $("#inputEmail").val(),
        };
        postData("assets/php/selectPatientEmails.php", prepareData(details))
            .then(data => {
                patientEmails = data;
                populatePatientEmails();
            });
    }
}

function populatePatientEmails() {
    var r = new Array(), j = -1;
    r[++j] = "<option value=\"0\">Select an email</option>";
    for (var i = 0; i < patientEmails.length; i++) {
        r[++j] = "<option value=\"";
        r[++j] = patientEmails[i].patient_id;
        r[++j] = "\">";
        r[++j] = patientEmails[i].email_address;
        r[++j] = "</option>";
    }
    $("#patientEmails").html(r.join(""));
}

function fillInfo() {
    if(selectedPatient > -1) {
        $("#patientInfoFName").text(patientEmails[selectedPatient].first_name);
        $("#patientInfoLName").text(patientEmails[selectedPatient].last_name);
        $("#patientInfoMobile").text(patientEmails[selectedPatient].mobile_number);
        $("#patientInfoBirthday").text(getDate(new Date(patientEmails[selectedPatient].date_of_birth)));
    } else {
        $("#patientInfoFName").text("");
        $("#patientInfoLName").text("");
        $("#patientInfoMobile").text("");
        $("#patientInfoBirthday").text("");
    }
}

function fetchMedicationList() {
    postData("assets/php/selectMedStock.php", "")
        .then(data => {
            medicationList = data;
            populateMeds();
        })
}

function populateMeds() {
    var r = new Array(), j = -1;
    r[++j] = "<option selected value=\"0\">Select a Medication</option>";
    for (var i = 0; i < medicationList.length; i++) {
        r[++j] = "<option value=\"";
        r[++j] = medicationList[i].medication_id;
        r[++j] = "\">";
        r[++j] = medicationList[i].medication_name;
        r[++j] = "</option>";
    }
    $("#medSearch").html(r.join(""));
}

function insertPrescription(medication_id, quantity, start_date, end_date, usage_directions) {
    var details = {
        'patient_id': patientEmails[selectedPatient].patient_id,
        'medication_id': medication_id,
        'quantity': quantity,
        'start_date': start_date,
        'end_date': end_date,
        'usage_directions': usage_directions
    };
    postData("assets/php/insertPrescription.php", prepareData(details))
        .then(data => {
            if(data != "Error") {
                $("#modal-1").modal('toggle');
                clearModal1();
            }
        });
}

function clearModal1() {
    populateMeds();
    $("#presQuantity").val("");
    $("#presStart").val("");
    $("#presEnd").val("");
    $("#usageDirections").val("");
}