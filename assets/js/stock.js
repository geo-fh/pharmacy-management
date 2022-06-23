var stock;
var stringStock;
var stockProcessed = false;
var baseStock;
var currentPage = 1;
var sortDirection = [0, 0, 0, 0]; // 0 is unset, 1 is ascending, 2 is descending
var columns = ["batch_id", "medication_name", "quantity", "expiration_date"]
var columnTypes = ["Number", "String", "Number", "Date"]
var search;

$(function () {
    fetchStock();
    loadUser();
    setNeutralArrows();
})

function fetchStock() {
    postData("assets/php/selectAllStock.php", "")
        .then(data => {
            baseStock = data;
            stock = baseStock;
            displayStock();
        });
}

function populateStock(start, end) {
    var r = new Array(), j = -1;
    for (var i = start; i < end; i++) {
        r[++j] = "<tr><td>";
        r[++j] = stock[i].batch_id;
        r[++j] = "</td><td>";
        r[++j] = stock[i].medication_name;
        r[++j] = "</td><td>";
        r[++j] = stock[i].quantity;
        r[++j] = "</td><td>";
        r[++j] = getDate(new Date(stock[i].expiration_date));
        r[++j] = "</td><td><div class=\"btn-group\" role=\"group\"><button class=\"btn btn-primary\" id=\"editbatch";
        r[++j] = stock[i].batch_id;
        r[++j] = "\" type=\"button\">Edit</button><button class=\"btn btn-primary\" id=\"removebatch";
        r[++j] = stock[i].batch_id;
        r[++j] = "\" type=\"button\">Remove</button></div></td></tr>";
    }
    $("#stockList").html(r.join(""));
}

function sortColumn(columnName) {
    var index = columns.indexOf(columnName);
    var type = columnTypes[index]
    switch (type) {
        case 'Number':
            if (sortDirection[index] != 1) {
                stock.sort((a, b) => parseInt(a[columnName]) - parseInt(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                stock.sort((a, b) => parseInt(b[columnName]) - parseInt(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'String':
            if (sortDirection[index] != 1) {
                stock.sort((a, b) => a[columnName].localeCompare(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                stock.sort((a, b) => b[columnName].localeCompare(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'Date':
            if (sortDirection[index] != 1) {
                stock.sort((a, b) => (new Date(a[columnName])).getTime() - (new Date(b[columnName])).getTime());
                resetSortDirection(index, 1);
            } else {
                stock.sort((a, b) => (new Date(b[columnName])).getTime() - (new Date(a[columnName])).getTime());
                resetSortDirection(index, 2);
            }
            break;
        default:
            return;
    }
    console.log(sortDirection);
    displayStock();
}

function getDate(date) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

function updatePagination(currentPage) {
    var limit = $("#selectedLimit option:selected").val();
    var size = stock.length;
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
    $("#stockPagination").html(r.join(""));
}

$(document).on("click", "#stockPagination > li.page-item", function () {
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
    displayStock();
})

$(document).on("click", ".tablesorter > thead > tr > th", function () {
    if (this.id != "")
        sortColumn(this.id);
})

function displayStock() {
    var limit = $("#selectedLimit option:selected").val();
    var start = (currentPage - 1) * limit;
    var end = Math.min(parseInt(start) + parseInt(limit), stock.length);
    if (end > start)
        $("#dataTable_info").html(`Showing ${start + 1} to ${end} of ${stock.length}`);
    else
        $("#dataTable_info").html("No results found");
    populateStock(start, end);
    updatePagination(currentPage);
}

function changeLimit() {
    currentPage = 1;
    displayStock();
}

function setNeutralArrows() {
    for (var i = 0; i < 4; i++) {
        $('#' + columns[i]).addClass("header");
    }
}

$('#stockSearch').on("input", function (e) {
    if (e.target.value == "")
        stock = baseStock;
    else
        searchStock(e.target.value);
    displayStock();
})

function searchStock(text) {
    var index = 0;
    search = [];
    if (!stockProcessed)
        stringifyStock();
    for (key in stringStock) {
        var string = stringStock[key].toLowerCase();
        if (string.includes(text.toLowerCase())) {
            search[index] = baseStock[key];
            index++;
        }
    }
    stock = search;
}

function stringifyStock() {
    stringStock = [];
    for (key in stock) {
        var string = "";
        for (column in columns) {
            string += stock[key][columns[column]]
            if (columns[column] == "expiration_date")
                string += getDate(new Date(stock[key][columns[column]]));
            if (column < 3)
                string += " ";
        }
        stringStock[key] = string;
    }
    stockProcessed = true;
}