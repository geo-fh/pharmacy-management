var xhttp = new XMLHttpRequest();
var stock;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        stock = JSON.parse(this.responseText);
        populateStock();
        console.log(stock);
    }
};
xhttp.open("POST", "assets/php/selectAllStock.php", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.send();

function populateStock() {
    var stockList = document.getElementById('stockList');
    stockList.innerHTML="";
    var limit = document.getElementById('selectedLimit').value;
    console.log(limit);
    for (let i = 0; i < Math.min(stock.length, limit); i++) {
        stockList.innerHTML += "<tr><td>" + stock[i].batch_id + "</td><td>" + stock[i].medication_name + "</td><td>" + stock[i].quantity + "</td><td>" + stock[i].expiration_date + "</td><td><div class=\"btn-group\" role=\"group\"><button class=\"btn btn-primary\" type=\"button\">Edit</button><button class=\"btn btn-primary\" type=\"button\">Remove</button></div></td></tr>";
    }
    // document.getElementById('dataTable_info').innerText = "Showing " + ;
}