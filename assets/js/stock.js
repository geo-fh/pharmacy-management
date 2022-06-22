var stock;
var sortDirection = [false, false, false, false];

$(function() {
    fetchStock();
    loadUser();
})

function fetchStock() {
    postData("assets/php/selectAllStock.php", '')
    .then(data => {
      stock = data;
      populateStock();
    });
}

function populateStock() {
    var limit = document.getElementById('selectedLimit').value;
    var r = new Array(), j = -1;
    for (var i=0, size=Math.min(stock.length, limit); i<size; i++){
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

function sortColumn(columnName, index) {
    switch (columnName) {
        case 'batch_id':
            if (sortDirection[0]) {
                stock.sort((a, b) => parseInt(b.batch_id) - parseInt(a.batch_id));
            } else {
                stock.sort((a, b) => parseInt(a.batch_id) - parseInt(b.batch_id));
            }
            break;
        case 'medication_name':
            if (sortDirection[1]) {
                stock.sort((a, b) => b.medication_name.localeCompare(a.medication_name));
            } else {
                stock.sort((a, b) => a.medication_name.localeCompare(b.medication_name));
            }
            break;
        case 'quantity':
            if (sortDirection[2]) {
                stock.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
            } else {
                stock.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
            }
            break;
        case 'expiration_date':
            if (sortDirection[3]) {
                stock.sort((a, b) => (new Date(a.expiration_date)).getTime() - (new Date(b.expiration_date)).getTime());
            } else {
                stock.sort((a, b) => (new Date(b.expiration_date)).getTime() - (new Date(a.expiration_date)).getTime());
            }
            break;
        default:
            return;
    }
    sortDirection[index] = !sortDirection[index];
    populateStock();
}

function getDate(date) {
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep", "Oct","Nov","Dec"];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
}