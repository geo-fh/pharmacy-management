var stock;
var baseStock;
var currentPage = 1;
var sortDirection = [false, false, false, false];

$(function () {
    fetchStock();
    loadUser();
})

function fetchStock() {
    postData("assets/php/selectAllStock.php", '')
        .then(data => {
            stock = baseStock = data;
            displayStock();
        });
}

function populateStock(start, end) {
    var r = new Array(), j = -1;
    console.log(start + " " + end);
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
    $('#stockList').html(r.join(''));
    // document.getElementById('dataTable_info').innerText = "Showing " + ;
}

function sortColumn(columnName) {
    switch (columnName) {
        case 'batch_id':
            if (sortDirection[0]) {
                stock.sort((a, b) => parseInt(b.batch_id) - parseInt(a.batch_id));
                resetSortDirection(-1);
            } else {
                stock.sort((a, b) => parseInt(a.batch_id) - parseInt(b.batch_id));
                resetSortDirection(0);
            }
            break;
        case 'medication_name':
            if (sortDirection[1]) {
                stock.sort((a, b) => b.medication_name.localeCompare(a.medication_name));
                resetSortDirection(-1);
            } else {
                stock.sort((a, b) => a.medication_name.localeCompare(b.medication_name));
                resetSortDirection(1);
            }
            break;
        case 'quantity':
            if (sortDirection[2]) {
                stock.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
                resetSortDirection(-1);
            } else {
                stock.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
                resetSortDirection(2);
            }
            break;
        case 'expiration_date':
            if (sortDirection[3]) {
                stock.sort((a, b) => (new Date(b.expiration_date)).getTime() - (new Date(a.expiration_date)).getTime());
                resetSortDirection(-1);
            } else {
                stock.sort((a, b) => (new Date(a.expiration_date)).getTime() - (new Date(b.expiration_date)).getTime());
                resetSortDirection(3);
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

function resetSortDirection(index) {
    sortDirection = [false, false, false, false];
    if (index != -1) {
        sortDirection[index] = true;
    }
}

function updatePagination(currentPage) {
    var limit = $('#selectedLimit option:selected').val();
    var size = stock.length;
    var pages = Math.ceil(size / limit);
    var r = new Array(), j = -1;
    r[++j] = "<li class=\"page-item\"";
    if(currentPage == 1)
        r[++j] = " hidden=\"true\"";
    r[++j] = "id=\"previousPage\"><a class=\"page-link\" aria-label=\"Previous\" href=\"javascript:void(0)\"><span aria-hidden=\"true\">«</span></a></li>";
    for (var i = 1; i <= pages; i++) {
        r[++j] = "<li class=\"page-item";
        if(i == currentPage)
            r[++j] = " active";
        r[++j] = "\"id=\"page"
        r[++j] = i;
        r[++j] = "\"><a class=\"page-link\" href=\"javascript:void(0)\">";
        r[++j] = i;
        r[++j] = "</a></li>";
    }
    r[++j] = "<li class=\"page-item\""
    if(currentPage == pages)
        r[++j] = " hidden=\"true\"";
    r[++j] = "id=\"nextPage\"><a class=\"page-link\" aria-label=\"Next\" href=\"javascript:void(0)\"><span aria-hidden=\"true\">»</span></a></li>"
    $('#stockPagination').html(r.join(''));
}

$(document).on("click", "#stockPagination > li.page-item", function() {
    console.log(currentPage)
    switch(this.id) {
        case "previousPage":
            if(currentPage > 1)
                currentPage--;
            break;
        case "nextPage":
            if(currentPage < 5)
                currentPage++;
            break;
        default:
            currentPage = this.id.substr(4);
    }
    displayStock();
})

function displayStock() {
    var limit = $('#selectedLimit option:selected').val();
    var start = (currentPage-1)*limit;
    var end = parseInt(start) + parseInt(limit);
    populateStock(start, end);
    updatePagination(currentPage);
}

function changeLimit() {
    currentPage = 1;
    displayStock();
}