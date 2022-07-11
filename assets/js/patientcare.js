var patientEmails;
var selectedPatient = -1;
var medicationList;
var transactionCart = [{ transMed: 0, transQuantity: 1 }];
var baseOrders, orders;
var detailedOrders;
var currentPage = 1;
var sortDirection = [0, 0, 0, 0]; // 0 is unset, 1 is ascending, 2 is descending
var columns = ["order_id", "contents", "purchase_date", "total_price"];
var columnTypes = ["Number", "String", "Date", "Number"];
var pages;

$(function () {
    setEvents();
    fetchMedicationList();
    fillTransaction();
    setPrescriptionDatePicker();
})

function setEvents() {
    $(document).on("click", "#inputEmailButton", function () {
        fetchPatientEmails();
    })

    $(document).on("change", "#patientEmails", function () {
        $(".pcOptions").removeAttr("disabled");
        selectedPatient = this.selectedIndex - 1;
        fillInfo();
        fetchOrders();
        fillPatientSummary();
    })

    $("#medSearch").select2({
        dropdownParent: $("#modal-1")
    });

    $(document).on("click", "#addPresBtn", function () {
        var medication_id = $("option:selected", "#medSearch")[0].value
        var quantity = $("#presQuantity").val();
        var start_date = $("#presStart").datepicker("getDate");
        var end_date = $("#presEnd").datepicker("getDate");
        var usage_directions = $("#usageDirections").val();
        if (end_date - start_date > 0)
            insertPrescription(medication_id, quantity, start_date, end_date, usage_directions);
    })

    $(document).on("click", "#cancelPresBtn", function () {
        clearModal1();
    })

    $(document).on("click", "#addTransFieldBtn", function () {
        saveTransCart(transactionCart.length);
        if (transactionCart[transactionCart.length - 1].transMed > 0)
            addTransField();
    })

    $(document).on("hidden.bs.modal", "#modal-2", function () {
        transactionCart = [{ transMed: 0, transQuantity: 1 }];
        $("#transTable").html("");
        $("#totalPrice").html("");
    })

    $(document).on("click", "#launchTransModal", function () {
        fillTransaction();
        populateMeds();
    })

    $(document).on("click", ".btn-close", function () {
        removeTransField(this.id.substring(11));
    })

    $(document).on("change", ".modal2Table", function () {
        saveTransCart(transactionCart.length);
        fillTransTable();
        fillTotalPrice();
    })

    $(document).on("click", "#addTransBtn", function () {
        var total = 0;
        for (var i = 0; i < transactionCart.length; i++) {
            total += medicationList[transactionCart[i].transMed - 1].price * $("#transQuantity" + i).val()
        }
        insertOrder(total);
    })

    $(document).on("click", "#summaryBtn", function () {
        fetchPrescriptions();
    })

    $(document).on("click", "#ordersPagination > li.page-item", function () {
        switch (this.id) {
            case "previousPage":
                if (currentPage > 1)
                    currentPage--;
                break;
            case "nextPage":
                if (currentPage < pages)
                    currentPage++;
                break;
            default:
                currentPage = this.id.substr(4);
        }
        displayOrders();
    })

    $(document).on("click", ".tablesorter > thead > tr > th", function (e) {
        e.stopImmediatePropagation();
        if (this.id != "")
            sortColumn(this.id);
    })

    $(document).on("click", "#ordersList > tr", function () {
        var order_id = this.firstChild.innerHTML;
        displayDetailsModal(order_id)
    })
}

function fetchPatientEmails() {
    var email = $("#inputEmail").val();
    if (email != "") {
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
    if (selectedPatient > -1) {
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
    postData("assets/php/selectMedStock.php", prepareData({ 'otc': 'no' }))
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
    for (var i = 0; i < transactionCart.length; i++) {
        $("#transMed" + (i)).html(r.join(""));
        fixTransDropdown(i);
        $("#transMed" + i).val(transactionCart[i].transMed);
        $("#transQuantity" + i).val(transactionCart[i].transQuantity);
        fixTransDropdown(i);

    }
}

function insertPrescription(medication_id, quantity, start_date, end_date, usage_directions) {
    var details = {
        'patient_id': patientEmails[selectedPatient].patient_id,
        'medication_id': medication_id,
        'quantity': quantity,
        'start_date': start_date.toISOString().substring(0, 10),
        'end_date': end_date.toISOString().substring(0, 10),
        'usage_directions': usage_directions
    };
    postData("assets/php/insertPrescription.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
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

function fillTransaction() {
    var r = new Array(), j = -1;
    for (var i = 0; i < transactionCart.length; i++) {
        r[++j] = "<div class=\"row\" style=\"margin-bottom: 20px\"><div class=\"col\"><p class=\"d-xxl-flex justify-content-xxl-center\">Medication ";
        r[++j] = i + 1;
        if (transactionCart.length > 1) {
            r[++j] = "<button id=\"removeTrans";
            r[++j] = i;
            r[++j] = "\" class=\"btn-sm btn-close\" type=\"button\"></button>";
        }
        r[++j] = "</p><div class=\"row\" style=\"margin-bottom: 20px;\"><div class=\"col\"><span>Medication:&nbsp;</span></div><div class=\"col\">";
        r[++j] = "<select class=\"modalSelect modal2Table\" id=\"transMed";
        r[++j] = i;
        r[++j] = "\"></select></div></div><div class=\"row\" style=\"margin-bottom: 20px;\"><div class=\"col\"><span>Quantity:&nbsp;</span></div><div class=\"col\"><input id=\"transQuantity";
        r[++j] = i;
        r[++j] = "\" class=\"modal2Table\" type=\"number\" min=\"1\"></div></div></div></div>";
    }
    $("#transModal").html(r.join(""));
}

function addTransField() {
    saveTransCart(transactionCart.length + 1);
    fillTransaction();
    populateMeds();
    fillTransTable()
}

function removeTransField(index) {
    saveTransCart(transactionCart.length);
    transactionCart.splice(index, 1);
    fillTransaction();
    populateMeds();
    fillTransTable()
}

function fixTransDropdown(index) {
    $("#transMed" + (index)).select2({
        dropdownParent: $("#modal-2 .modal-body")
    });
}

function saveTransCart(length) {
    for (var i = 0; i < length; i++) {
        var transactionItem = { transMed: $("#transMed" + i).val(), transQuantity: $("#transQuantity" + i).val() }
        transactionCart[i] = transactionItem;
    }
}

function fillTransTable() {
    var r = new Array(), j = -1;
    for (var i = 0; i < transactionCart.length; i++) {
        r[++j] = "<tr><td>";
        if (transactionCart[i].transMed > 0)
            r[++j] = medicationList[transactionCart[i].transMed - 1].medication_name;
        r[++j] = "</td><td>";
        r[++j] = $("#transQuantity" + i).val();
        r[++j] = "</td><td>";
        if (transactionCart[i].transMed > 0) {
            r[++j] = (medicationList[transactionCart[i].transMed - 1].price * $("#transQuantity" + i).val()).toLocaleString('en-US');
            r[++j] = " LBP";
        }
        r[++j] = "</td></tr>";
    }
    $("#transTable").html(r.join(""));
}

function fillTotalPrice() {
    var total = 0;
    for (var i = 0; i < transactionCart.length; i++) {
        total += medicationList[transactionCart[i].transMed - 1].price * $("#transQuantity" + i).val()
    }
    $("#totalPrice").html(total.toLocaleString('en-US') + " LBP");
}

function insertOrder(total_price) {
    var details = {
        'patient_id': patientEmails[selectedPatient].patient_id,
        'purchase_date': new Date().toISOString().substring(0, 10),
        'total_price': total_price
    };
    postData("assets/php/insertIntoOrders.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                for (var i = 0; i < transactionCart.length; i++) {
                    var order_id = data;
                    var medication_id = transactionCart[i].transMed;
                    var quantity = transactionCart[i].transQuantity;
                    var price = medicationList[medication_id - 1].price * quantity;
                    insertOrderMedication(order_id, medication_id, quantity, price)
                }
            }
        });
}

function insertOrderMedication(order_id, medication_id, quantity, price) {
    var details = {
        'order_id': order_id,
        'medication_id': medication_id,
        'quantity': quantity,
        'price': price
    };
    postData("assets/php/insertIntoOrderMedication.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                $("#modal-2").modal('toggle');
            }
        });
}

function fetchOrders() {
    postData("assets/php/selectTransactionLog.php", prepareData({ 'patient_id': patientEmails[selectedPatient].patient_id }))
        .then(data => {
            baseOrders = data;
            orders = baseOrders;
            postData("assets/php/selectOrderMedication.php", prepareData({ 'patient_id': patientEmails[selectedPatient].patient_id }))
                .then(data => {
                    detailedOrders = mergeMedicationNames(data)
                    addMedToArray();
                    displayOrders();
                    setNeutralArrows();
                });
        });
}

function mergeMedicationNames(array) {
    var dropIndices = [];
    for (var i = 0; i < array.length - 1; i++) {
        if (array[i].order_id == array[i + 1].order_id) {
            array[i].medication_name += ", ";
            array[i].medication_name += array[i + 1].medication_name;
            dropIndices.push(i + 1);
        }
    }
    for (var i = dropIndices.length - 1; i >= 0; i--) {
        array.splice(dropIndices[i], 1);
    }
    return array;
}

function addMedToArray() {
    for (var i = 0; i < orders.length; i++) {
        orders[i].contents = detailedOrders[i].medication_name;
    }
}

function displayOrders() {
    var limit = 10;
    var start = (currentPage - 1) * limit;
    var end = Math.min(parseInt(start) + parseInt(limit), orders.length);
    if (end > start)
        $("#dataTable_info").html(`Showing ${start + 1} to ${end} of ${orders.length}`);
    else
        $("#dataTable_info").html("No results found");
    populateOrders(start, end);
    updatePagination(currentPage);
}

function populateOrders(start, end) {
    var r = new Array(), j = -1;
    for (var i = start; i < end; i++) {
        r[++j] = "<tr><td>";
        r[++j] = orders[i].order_id;
        r[++j] = "</td><td>";
        r[++j] = orders[i].contents;
        r[++j] = "</td><td>";
        r[++j] = getDate(new Date(orders[i].purchase_date));
        r[++j] = "</td><td>";
        r[++j] = (parseInt(orders[i].total_price).toLocaleString("en-US"));
        r[++j] = "</td></tr>";
    }
    $("#ordersList").html(r.join(""));
}

function updatePagination(currentPage) {
    var limit = 10;
    var size = orders.length;
    pages = Math.ceil(size / limit);
    var r = new Array(), j = -1;
    r[++j] = "<li class=\"page-item\"";
    if (currentPage == 1)
        r[++j] = " hidden=\"true\"";
    r[++j] = "id=\"previousPage\"><a class=\"page-link\" aria-label=\"Previous\" href=\"javascript:void(0)\"><span aria-hidden=\"true\">«</span></a></li>";
    for (var i = 1; i <= pages; i++) {
        r[++j] = "<li class=\"page-item";
        if (i == currentPage)
            r[++j] = " active";
        r[++j] = "\"id=\"page"
        r[++j] = i;
        r[++j] = "\"><a class=\"page-link\" href=\"javascript:void(0)\">";
        r[++j] = i;
        r[++j] = "</a></li>";
    }
    r[++j] = "<li class=\"page-item\""
    if (currentPage == pages)
        r[++j] = " hidden=\"true\"";
    r[++j] = "id=\"nextPage\"><a class=\"page-link\" aria-label=\"Next\" href=\"javascript:void(0)\"><span aria-hidden=\"true\">»</span></a></li>"
    $("#ordersPagination").html(r.join(""));
}

function sortColumn(columnName) {
    var index = columns.indexOf(columnName);
    var type = columnTypes[index]
    switch (type) {
        case 'Number':
            if (sortDirection[index] != 1) {
                orders.sort((a, b) => parseInt(a[columnName]) - parseInt(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                orders.sort((a, b) => parseInt(b[columnName]) - parseInt(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'String':
            if (sortDirection[index] != 1) {
                orders.sort((a, b) => a[columnName].localeCompare(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                orders.sort((a, b) => b[columnName].localeCompare(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'Date':
            if (sortDirection[index] != 1) {
                orders.sort((a, b) => (new Date(a[columnName])).getTime() - (new Date(b[columnName])).getTime());
                resetSortDirection(index, 1);
            } else {
                orders.sort((a, b) => (new Date(b[columnName])).getTime() - (new Date(a[columnName])).getTime());
                resetSortDirection(index, 2);
            }
            break;
        default:
            return;
    }
    displayOrders();
}

function resetSortDirection(index, dir) {
    sortDirection = [0, 0, 0, 0];
    if (dir == 1) {
        sortDirection[index] = 1;
    } else if (dir == 2) {
        sortDirection[index] = 2;
    }
    sortArrows();
}

function setNeutralArrows() {
    for (var i = 0; i < columns.length; i++) {
        $('#' + columns[i]).addClass("header");
        $('#' + columns[i]).removeClass("headerSortUp");
        $('#' + columns[i]).removeClass("headerSortDown");
    }
}

function sortArrows() {
    for (var i = 0; i < sortDirection.length; i++) {
        switch (sortDirection[i]) {
            case 0:
                $('#' + columns[i]).removeClass("headerSortUp");
                $('#' + columns[i]).removeClass("headerSortDown");
                break;
            case 1:
                $('#' + columns[i]).addClass("headerSortUp");
                $('#' + columns[i]).removeClass("headerSortDown");
                break;
            case 2:
                $('#' + columns[i]).addClass("headerSortDown");
                $('#' + columns[i]).removeClass("headerSortUp");
                break;
            default:
                return;
        }
    }
}

function displayDetailsModal(order_id) {
    $("#modal5Title").text("Order #" + order_id);
    postData("assets/php/selectOrderDetails.php", prepareData({ 'order_id': order_id }))
        .then(data => {
            fillDetailsModal(data);
        });
    $("#modal-5").modal("toggle");
}

function fillDetailsModal(details) {
    var r = new Array(), j = -1;
    var total = 0;
    for (var i = 0; i < details.length; i++) {
        r[++j] = "<tr><td>";
        r[++j] = details[i].medication_name;
        r[++j] = "</td><td>";
        r[++j] = details[i].quantity;
        r[++j] = "</td><td>";
        r[++j] = (parseInt(details[i].price)).toLocaleString("en-US") + " LBP";
        r[++j] = "</td></tr>";
        total += parseInt(details[i].price);
    }
    $("#totalPriceDetails").html(total.toLocaleString("en-US") + " LBP");
    $("#orderDetailsTable").html(r.join(""));
}

function fillPatientSummary() {
    fetchPatientGeneralInfo();
    fetchpAandpD();
}

function fetchPatientGeneralInfo() {
    var details = {
        'patient_id': patientEmails[selectedPatient].patient_id
    };
    postData("assets/php/selectFromPatientPatientId.php", prepareData(details))
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
        'patient_id': patientEmails[selectedPatient].patient_id
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
        'patient_id': patientEmails[selectedPatient].patient_id
    };
    postData("assets/php/selectPrescriptions.php", prepareData(details))
        .then(data => {
            populatePrescriptions(data);
        })
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

function populatePatientAllergies() {
    var r = new Array(), j = -1;
    for (var i = 0; i < patientAllergies.length; i++) {
        r[++j] = "<div class=\"d-xxl-flex align-items-xxl-center\"><span class=\"text-center aanddlist\">";
        r[++j] = patientAllergies[i].allergy_name;
        r[++j] = "</span></div>";
    }
    if (patientAllergies.length != 0) {
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
    if (patientAllergies.length != 0) {
        $("#patientDiseases").html(r.join(""));
    } else {
        $("#patientDiseases").html("None");
    }
}

function setPrescriptionDatePicker() {
    presStart = $("#presStart")
        .datepicker({
            minDate: new Date(),
            changeMonth: true,
            dateFormat: 'dd-MM-yy',
            onSelect: function () {
                presEnd.datepicker("option", "minDate", presStart.datepicker('getDate'));
            }
        }),
        presEnd = $("#presEnd")
            .datepicker({
                minDate: new Date(),
                changeMonth: true,
                dateFormat: 'dd-MM-yy',
                onSelect: function () {
                    presStart.datepicker("option", "maxDate", presEnd.datepicker('getDate'));
                }
            })

    $("#presStart").datepicker("setDate", new Date());
}