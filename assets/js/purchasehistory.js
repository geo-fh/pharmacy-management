var baseOrders, orders, stringOrders;
var search;
var detailedOrders;
var ordersProcessed = false;
var currentPage = 1;
var sortDirection = [0, 0, 0, 0]; // 0 is unset, 1 is ascending, 2 is descending
var columns = ["order_id", "contents", "purchase_date", "total_price"];
var columnTypes = ["Number", "String", "Date", "Number"];
var pages;

$(function () {
    fetchOrders();
    setEvents();
})

function setEvents() {
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

    $(document).on("change", "#selectedLimit", function () {
        currentPage = 1;
        displayOrders();
    })

    $(document).on("click", ".tablesorter > thead > tr > th", function (e) {
        e.stopImmediatePropagation();
        if (this.id != "")
            sortColumn(this.id);
    })

    $(document).on("input", "#ordersSearch", function (e) {
        if (e.target.value == "")
            orders = baseOrders;
        else
            searchOrders(e.target.value);
        displayOrders();
    })
    
    $(document).on("click", "#ordersList > tr", function () {
        var order_id = this.firstChild.innerHTML;
        displayDetailsModal(order_id)
    })
}

function fetchOrders() {
    postData("assets/php/selectTransactionLog.php", prepareData({ 'token': getCookie("sessionToken") }))
        .then(data => {
            baseOrders = data;
            orders = baseOrders;
            postData("assets/php/selectOrderMedication.php", prepareData({ 'token': getCookie("sessionToken") }))
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
    var limit = $("#selectedLimit option:selected").val();
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
    var limit = $("#selectedLimit option:selected").val();
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

function searchOrders(text) {
    var index = 0;
    search = [];
    if (!ordersProcessed)
        stringifyOrders();
    for (key in stringOrders) {
        var string = stringOrders[key].toLowerCase();
        if (string.includes(text.toLowerCase())) {
            search[index] = baseOrders[key];
            index++;
        }
    }
    orders = search;
}

function stringifyOrders() {
    stringOrders = [];
    for (key in orders) {
        var string = "";
        for (column in columns) {
            string += orders[key][columns[column]]
            if (columns[column] == "purchase_date") {
                string += " ";
                string += getDate(new Date(orders[key][columns[column]]));
            }
            if (column < columns.length)
                string += " ";
        }
        stringOrders[key] = string;
    }
    ordersProcessed = true;
}

function displayDetailsModal(order_id) {
    $("#modal1Title").text("Order #" + order_id);
    postData("assets/php/selectOrderDetails.php", prepareData({ 'order_id': order_id }))
        .then(data => {
            fillDetailsModal(data);
        });
    $("#modal-1").modal("toggle");
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