$(function () {
    setEvents();
    setMostSoldPicker();
    fetchOrderSales();
    fetchMostSold();
    fetchSoonExpired();
    fetchOutOfStock();
    fetchOrdersStatus();
})

function setEvents() {

}

function setMostSoldPicker() {
    mostSoldStart = $("#mostSoldStart")
        .datepicker({
            maxDate: new Date(),
            changeMonth: true,
            dateFormat: 'dd-MM-yy',
            onSelect: function () {
                mostSoldEnd.datepicker("option", "minDate", mostSoldStart.datepicker('getDate'));
                fetchMostSold();
            }
        }),
        mostSoldEnd = $("#mostSoldEnd")
            .datepicker({
                maxDate: new Date(),
                changeMonth: true,
                dateFormat: 'dd-MM-yy',
                onSelect: function () {
                    mostSoldStart.datepicker("option", "maxDate", mostSoldEnd.datepicker('getDate'));
                    fetchMostSold();
                }
            })

    $("#mostSoldStart").datepicker("setDate", new Date(new Date().getFullYear(), 0, 1));
    $("#mostSoldEnd").datepicker("setDate", new Date());
}

function fetchOrderSales() {
    postData("assets/php/selectOrdersStats.php", "")
        .then(data => {
            splitIntoMonths(data);
        })
}

function fetchMostSold() {
    var details = {
        'start_date': new Date($("#mostSoldStart").datepicker('getDate')).toISOString().substring(0, 10),
        'end_date': new Date($("#mostSoldEnd").datepicker('getDate')).toISOString().substring(0, 10)
    }
    postData("assets/php/selectMostSold.php", prepareData(details))
        .then(data => {
            fillMostSold(data);
        })
}

function fetchSoonExpired() {
    postData("assets/php/selectSoonExpired.php", "")
        .then(data => {
            fillExpiryTable(data);
        })
}

function fetchOutOfStock() {
    postData("assets/php/selectOOS.php", "")
        .then(data => {
            fillOOSTable(data);
        })
}

function fetchOrdersStatus() {
    var today = new Date();
    var details = {
        'start_date': today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + "1",
        'end_date': today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + daysInMonth(today.getMonth() + 1, today.getFullYear())
    }
    postData("assets/php/selectOrderStatus.php", prepareData(details))
        .then(data => {
            fillDoughnut(data);
        })
}

function fillDoughnut(stats) {
    var data = [0, 0, 0];
    for (i in data) {
        if (stats.findIndex(x => x.status === i) != -1)
            data[i] = stats[stats.findIndex(x => x.status === i)].count;
    }
    const donutChart = $("#donutChart");
    const myChart = new Chart(donutChart, {
        type: 'doughnut',
        data: {
            labels: [
                'Completed',
                'Processing',
                'Cancelled'
            ],
            datasets: [{
                label: '',
                backgroundColor: [
                    'rgb(28,200,138)',
                    'rgb(78,115,223)',
                    'rgb(255,0,0)'
                ],
                borderColor: [
                    'rgb(255,255,255)',
                    'rgb(255,255,255)',
                    'rgb(255,255,255)'
                ],
                data: data
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                    fontStyle: 'normal'
                }
            },

            title: {
                fontStyle: 'normal'
            }
        }
    });
}

function fillLine(stats) {
    const lineChart = $("#lineChart");
    const myChart = new Chart(lineChart, {
        type: 'line',
        data: {
            labels: currentMonths(),
            datasets: [{
                label: 'Earnings',
                fill: true,
                data: stats,
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                borderColor: 'rgba(78, 115, 223, 1)'
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                    fontStyle: 'normal'
                }
            },
            title: {
                fontStyle: 'normal'
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: 'rgb(234, 236, 244)',
                        zeroLineColor: 'rgb(234, 236, 244)',
                        drawBorder: false,
                        drawTicks: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2],
                        drawOnChartArea: false
                    },
                    ticks: {
                        fontColor: 'rgb(133,135,150)',
                        fontStyle: 'normal',
                        padding: 20
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgb(234, 236, 244)',
                        zeroLineColor: 'rgb(234, 236, 244)',
                        drawBorder: false,
                        drawTicks: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    },
                    ticks: {
                        fontColor: 'rgb(133,135,150)',
                        fontStyle: 'normal',
                        padding: 20,
                        userCallback: function (value) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value;
                        }
                    }
                }]
            }

        }
    });
}

function fillMostSold(stats) {
    var labels = [];
    var quantity = [];
    var limit = Math.min(5, stats.length)
    for (var i = 0; i < limit; i++) {
        labels.push(stats[i].medication_name);
        quantity.push(stats[i].quan);
    }
    const mostSold = $("#mostSold");
    const myChart = new Chart(mostSold, {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                axis: 'y',
                label: '',
                data: quantity,
                fill: false,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false,
                labels: {
                    fontStyle: 'normal'
                }
            },
        }
    });
}

function currentMonths() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const returnMonths = [];
    for (var i = 0; i <= (new Date().getMonth()); i++) {
        returnMonths.push(months[i]);
    }
    return returnMonths;
}

function splitIntoMonths(results) {
    var stats = new Array(12).fill(0);
    for (var i = 0; i < results.length; i++) {
        stats[new Date(results[i].purchase_date).getMonth()] += parseInt(results[i].total_price);
    }
    fillLine(stats);
    fillStats(stats, results);
}

function fillStats(stats, results) {
    var avg = 0, total = 0;
    for (var i = 0; i < stats.length; i++) {
        total += stats[i];
    }
    avg = total / (new Date().getMonth() + 1);
    $("#annualEarnings").text(total.toLocaleString() + " LBP");
    $("#monthlyEarnings").text(Math.round(avg).toLocaleString() + " LBP");
    $("#annualOrders").text(results.length);
    $("#monthlyOrders").text((results.length / (new Date().getMonth() + 1)).toFixed(2));
}

function fillExpiryTable(stats) {
    var expired = false;
    var today = new Date();
    var r = new Array(), j = -1;
    for (var i = 0; i < stats.length; i++) {
        var temp_remaining = "";
        var expiry_date = new Date(stats[i].expiration_date);
        if (today > expiry_date) {
            temp_remaining = "Expired!";
            expired = true;
        } else {
            if (expiry_date.getFullYear() - today.getFullYear() == 1) {
                temp_remaining += (expiry_date.getFullYear() - today.getFullYear()) + " year ";
            } else if (expiry_date.getFullYear() - today.getFullYear() > 1) {
                temp_remaining += (expiry_date.getFullYear() - today.getFullYear()) + " years ";
            }
            if (expiry_date.getDate() - today.getDate() >= 0) {
                if (expiry_date.getMonth() - today.getMonth() == 1) {
                    temp_remaining += (expiry_date.getMonth() - today.getMonth()) + " month ";
                } else if (expiry_date.getMonth() - today.getMonth() > 1) {
                    temp_remaining += (expiry_date.getMonth() - today.getMonth()) + " months ";
                }
            } else {
                temp_remaining += (expiry_date.getMonth() - today.getMonth() - 1) + " months ";
            }
            if (expiry_date.getDate() - today.getDate() == 1) {
                temp_remaining += "1 day";
            } else if (expiry_date.getDate() - today.getDate() > 1) {
                temp_remaining += (expiry_date.getDate() - today.getDate()) + " days";
            } else if (expiry_date.getDate() - today.getDate() < 0) {
                var days = expiry_date.getDate() + daysInMonth(expiry_date.getMonth(), expiry_date.getFullYear()) - today.getDate();
                temp_remaining += days + " days";
            }
        }
        if (expired)
            r[++j] = "<tr class=\"statsError\"><td>";
        else
            r[++j] = "<tr><td>";
        r[++j] = stats[i].batch_id;
        r[++j] = "</td><td>";
        r[++j] = stats[i].medication_name;
        r[++j] = "</td><td>";
        r[++j] = stats[i].quantity;
        r[++j] = "</td><td>";
        r[++j] = temp_remaining;
        r[++j] = "</td></tr>";
    }
    $("#expiryTable").html(r.join(""));
}

function fillOOSTable(stats) {
    var today = new Date();
    var r = new Array(), j = -1;
    for (var i = 0; i < stats.length; i++) {
        if (stats[i].quantity == 0 || stats[i].quantity == null) {
            r[++j] = "<tr class=\"statsError\"><td>";
            r[++j] = stats[i].medication_id;
            r[++j] = "</td><td>";
            r[++j] = stats[i].medication_name;
            r[++j] = "</td><td>";
            r[++j] = "Out of Stock";
            r[++j] = "</td></tr>";
        } else {
            r[++j] = "<tr><td>";
            r[++j] = stats[i].medication_id;
            r[++j] = "</td><td>";
            r[++j] = stats[i].medication_name;
            r[++j] = "</td><td>";
            r[++j] = stats[i].quantity;
            r[++j] = "</td></tr>";
        }
    }
    $("#OOSTable").html(r.join(""));
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}