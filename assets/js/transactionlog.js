var baseLog, transactionLog, stringLog;
var search;
var detailedLog;
var logProcessed = false;
var currentPage = 1;
var sortDirection = [0, 0, 0, 0, 0]; // 0 is unset, 1 is ascending, 2 is descending
var columns = ["order_id", "email_address", "contents", "purchase_date", "total_price"];
var columnTypes = ["Number", "String", "String", "Date", "Number"];
var transactionCart = [{ transMed: 0, transQuantity: 1 }];
var patientEmails;
var medicationList;

$(function () {
    fetchLog();
    setNeutralArrows();
    setEvents();
    fetchMedicationList();
    fillTransaction();
})

function setEvents() {
    $(document).on("click", "#logPagination > li.page-item", function () {
        switch (this.id) {
            case "previousPage":
                if (currentPage > 1)
                    currentPage--;
                break;
            case "nextPage":
                if (currentPage < 5)
                    currentPage++;
                break;
            default:
                currentPage = this.id.substr(4);
        }
        displayLog();
    })

    $(document).on("change", "#selectedLimit", function () {
        currentPage = 1;
        displayLog();
    })

    $(document).on("click", ".tablesorter > thead > tr > th", function () {
        if (this.id != "")
            sortColumn(this.id);
    })

    $(document).on("input", "#logSearch", function (e) {
        if (e.target.value == "")
            transactionLog = baseLog;
        else
            searchLog(e.target.value);
        displayLog();
    })

    $(document).on("click", "#inputEmailButton", function () {
        fetchPatientEmails();
    })

    $(document).on("click", "#addTransFieldBtn", function () {
        console.log(transactionCart)
        saveTransCart(transactionCart.length);
        if (transactionCart[transactionCart.length - 1].transMed > 0)
            addTransField();
    })

    $(document).on("hidden.bs.modal", "#modal-1", function () {
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

    $(document).on("change", ".modal1Table", function () {
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
}

function fetchLog() {
    postData("assets/php/selectTransactionLog.php", "")
        .then(data => {
            baseLog = data;
            transactionLog = baseLog;
            postData("assets/php/selectOrderMedication.php", "")
                .then(data => {
                detailedLog = mergeMedicationNames(data)
                addMedToArray();
                displayLog();
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
    for (var i = 0; i < transactionLog.length; i++) {
        transactionLog[i].contents = detailedLog[i].medication_name;
    }
}

function displayLog() {
    var limit = $("#selectedLimit option:selected").val();
    var start = (currentPage - 1) * limit;
    var end = Math.min(parseInt(start) + parseInt(limit), transactionLog.length);
    if (end > start)
        $("#dataTable_info").html(`Showing ${start + 1} to ${end} of ${transactionLog.length}`);
    else
        $("#dataTable_info").html("No results found");
    populateLog(start, end);
    updatePagination(currentPage);
}

function populateLog(start, end) {
    var r = new Array(), j = -1;
    for (var i = start; i < end; i++) {
        r[++j] = "<tr><td>";
        r[++j] = transactionLog[i].order_id;
        r[++j] = "</td><td>";
        r[++j] = transactionLog[i].email_address;
        r[++j] = "</td><td>";
        r[++j] = transactionLog[i].contents;
        r[++j] = "</td><td>";
        r[++j] = getDate(new Date(transactionLog[i].purchase_date));
        r[++j] = "</td><td>";
        r[++j] = (parseInt(transactionLog[i].total_price).toLocaleString("en-US"));
        r[++j] = "</td></tr>";
    }
    $("#transactionList").html(r.join(""));
}

function updatePagination(currentPage) {
    var limit = $("#selectedLimit option:selected").val();
    var size = transactionLog.length;
    var pages = Math.ceil(size / limit);
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
    $("#logPagination").html(r.join(""));
}

function sortColumn(columnName) {
    var index = columns.indexOf(columnName);
    var type = columnTypes[index]
    switch (type) {
        case 'Number':
            if (sortDirection[index] != 1) {
                transactionLog.sort((a, b) => parseInt(a[columnName]) - parseInt(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                transactionLog.sort((a, b) => parseInt(b[columnName]) - parseInt(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'String':
            if (sortDirection[index] != 1) {
                transactionLog.sort((a, b) => a[columnName].localeCompare(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                transactionLog.sort((a, b) => b[columnName].localeCompare(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'Date':
            if (sortDirection[index] != 1) {
                transactionLog.sort((a, b) => (new Date(a[columnName])).getTime() - (new Date(b[columnName])).getTime());
                resetSortDirection(index, 1);
            } else {
                transactionLog.sort((a, b) => (new Date(b[columnName])).getTime() - (new Date(a[columnName])).getTime());
                resetSortDirection(index, 2);
            }
            break;
        default:
            return;
    }
    displayLog();
}

function resetSortDirection(index, dir) {
    sortDirection = [0, 0, 0, 0, 0];
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

function searchLog(text) {
    var index = 0;
    search = [];
    if (!logProcessed)
        stringifyLog();
    for (key in stringLog) {
        var string = stringLog[key].toLowerCase();
        if (string.includes(text.toLowerCase())) {
            search[index] = baseLog[key];
            index++;
        }
    }
    transactionLog = search;
}

function stringifyLog() {
    stringLog = [];
    for (key in transactionLog) {
        var string = "";
        for (column in columns) {
            string += transactionLog[key][columns[column]]
            if (columns[column] == "purchase_date") {
                string += " ";
                string += getDate(new Date(transactionLog[key][columns[column]]));
            }
            if (column < columns.length)
                string += " ";
        }
        stringLog[key] = string;
    }
    logProcessed = true;
    console.log(stringLog)
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
    for (var i = 0; i < transactionCart.length; i++) {
        $("#transMed" + (i)).html(r.join(""));
        fixTransDropdown(i);
        $("#transMed" + i).val(transactionCart[i].transMed);
        $("#transQuantity" + i).val(transactionCart[i].transQuantity);
        fixTransDropdown(i);

    }
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
        r[++j] = "<select class=\"modalSelect modal1Table\" id=\"transMed";
        r[++j] = i;
        r[++j] = "\"></select></div></div><div class=\"row\" style=\"margin-bottom: 20px;\"><div class=\"col\"><span>Quantity:&nbsp;</span></div><div class=\"col\"><input id=\"transQuantity";
        r[++j] = i;
        r[++j] = "\" class=\"modal1Table\" type=\"number\" min=\"1\"></div></div></div></div>";
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
        dropdownParent: $("#modal-1 .modal-body")
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
    console.log(details)
    postData("assets/php/insertIntoOrders.php", prepareData(details))
        .then(data => {
            console.log(data)
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
    console.log(details)
    postData("assets/php/insertIntoOrderMedication.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                $("#modal-1").modal('toggle');
            }
        });
}