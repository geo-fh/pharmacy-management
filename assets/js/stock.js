var stock;
fetch("assets/php/selectAllStock.php").then((res) => res.json())
.then(response => {
    stock = response;
    populateStock();
}).catch(error => console.log(error));

function populateStock() {
    var stockList = document.getElementById('stockList');
    stockList.innerHTML="";
    var limit = document.getElementById('selectedLimit').value;
    console.log(limit);
    for (let i = 0; i < Math.min(stock.length, limit); i++) {
        stockList.innerHTML += "<tr><td>" + stock[i].batch_id + "</td><td>" + stock[i].medication_name + "</td><td>" + stock[i].quantity + "</td><td>" + stock[i].expiration_date + "</td><td><div class=\"btn-group\" role=\"group\"><button class=\"btn btn-primary\" id=\"editbatch" + stock[i].batch_id + "\" type=\"button\">Edit</button><button class=\"btn btn-primary\" id=\"removebatch" + stock[i].batch_id + "\" type=\"button\">Remove</button></div></td></tr>";
    }
    // document.getElementById('dataTable_info').innerText = "Showing " + ;
}