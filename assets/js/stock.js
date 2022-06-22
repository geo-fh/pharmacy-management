var stock;
var sortDirection = false;

window.onload = () => {
    fetchStock();
}

function fetchStock() {
    fetch("assets/php/selectAllStock.php").then((res) => res.json())
        .then(response => {
            stock = response;
            populateStock();
        }).catch(error => console.log(error));
}

function populateStock() {
    var stockList = document.getElementById('stockList');
    var limit = document.getElementById('selectedLimit').value;
    var tableData = '';
    for (let i = 0; i < Math.min(stock.length, limit); i++) {
        tableData += `<tr><td>${stock[i].batch_id}</td><td>${stock[i].medication_name}</td><td>${stock[i].quantity}</td><td>${stock[i].expiration_date}</td><td><div class=\"btn-group\" role=\"group\"><button class=\"btn btn-primary\" id=\"editbatch${stock[i].batch_id}\" type=\"button\">Edit</button><button class=\"btn btn-primary\" id=\"removebatch${stock[i].batch_id}\" type=\"button\">Remove</button></div></td></tr>`;
    }
    stockList.innerHTML = tableData;
    // document.getElementById('dataTable_info').innerText = "Showing " + ;
}

function sortColumn(columnName) {
    switch (columnName) {
        case 'batch_id':
            if (sortDirection) {
                stock.sort((a, b) => parseInt(a.batch_id) - parseInt(b.batch_id));
            } else {
                stock.sort((a, b) => parseInt(b.batch_id) - parseInt(a.batch_id));
            }
            break;
        case 'medication_name':
            if (sortDirection) {
                stock.sort((a, b) => toString(a.medication_name) - toString(b.medication_name));
            } else {
                stock.sort((a, b) => toString(b.medication_name) - toString(a.medication_name));
            }
            break;
        case 'quantity':
            if (sortDirection) {
                stock.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
            } else {
                stock.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
            }
            break;
        case 'expiration_date':
            if (sortDirection) {
                stock.sort((a, b) => Date(a.expiration_date) - Date(b.expiration_date));
            } else {
                stock.sort((a, b) => Date(b.expiration_date) - Date(a.expiration_date));
            }
            break;
        default:
            return;
    }
    sortDirection = !sortDirection;
    populateStock();
}