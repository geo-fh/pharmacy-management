async function postData(url = '', params) {
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  }).catch(function (error) {
    console.log(error);
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function prepareData(details) {
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

function loadUser() {

}

function getDate(date) {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

populateSidebar('pharmacist');

function populateSidebar(usertype) {
  var r = new Array(), j = -1;
  switch (usertype) {
    case 'pharmacist':
      r[++j] = "<li class=\"nav-item\"><a id=\"statPage\" class=\"nav-link\" href=\"dashboard.html\"><i class=\"far fa-chart-bar\"></i><span>Statistics</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"patientCarePage\" class=\"nav-link\" href=\"patientcare.html\"><i class=\"fas fa-user-circle\"></i><span>Patient Care</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"productsPage\" class=\"nav-link\" href=\"productlist.html\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"stockPage\" class=\"nav-link\" href=\"stock.html\"><i class=\"fas fa-bullseye\"></i><span>Stock</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"transactionPage\" class=\"nav-link\" href=\"transactionlog.html\"><i class=\"fas fa-receipt\"></i><span>Transaction Log</span></a></li>";
      break;
    case 'patient':
      r[++j] = "<li class=\"nav-item\"><a id=\"homePage\" class=\"nav-link\" href=\"index.html\"><i class=\"fas fa-home\"></i><span>Home</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"profilePage\" class=\"nav-link\" href=\"profile.html\"><i class=\"fas fa-user\"></i><span>Profile</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"historyPage\" class=\"nav-link\" href=\"purchasehistory.html\"><i class=\"fas fa-receipt\"></i><span>Purchase History</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"summaryPage\" class=\"nav-link\" href=\"patientsummary.html\"><i class=\"fas fa-user-circle\"></i><span>Patient Summary</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"productsPage\" class=\"nav-link\" href=\"productlist.html\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
      break;
    case 'admin':
      r[++j] = "<li class=\"nav-item\"><a id=\"statsPage\" class=\"nav-link\" href=\"dashboard.html\"><i class=\"far fa-chart-bar\"></i><span>Statistics</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"productsPage\" class=\"nav-link\" href=\"productlist.html\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"stockPage\" class=\"nav-link\" href=\"stock.html\"><i class=\"fas fa-bullseye\"></i><span>Stock</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"transactionPage\" class=\"nav-link\" href=\"transactionlog.html\"><i class=\"fas fa-receipt\"></i><span>Transaction Log</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"userManagementPage\" class=\"nav-link\" href=\"usermanagement.html\"><i class=\"fas fa-users\"></i><span>User Management</span></a></li>";
      break;
    default:
      return;
  }
  $("#accordionSidebar").html(r.join(""));
}