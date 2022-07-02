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
      r[++j] = "<li class=\"nav-item\"><a id=\"dashboardPage\" class=\"nav-link\" href=\"dashboard\"><i class=\"far fa-chart-bar\"></i><span>Statistics</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"patientcarePage\" class=\"nav-link\" href=\"patientcare\"><i class=\"fas fa-user-circle\"></i><span>Patient Care</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"productlistPage\" class=\"nav-link\" href=\"productlist\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"stockPage\" class=\"nav-link\" href=\"stock\"><i class=\"fas fa-bullseye\"></i><span>Stock</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"transactionlogPage\" class=\"nav-link\" href=\"transactionlog\"><i class=\"fas fa-receipt\"></i><span>Transaction Log</span></a></li>";
      break;
    case 'patient':
      r[++j] = "<li class=\"nav-item\"><a id=\"indexPage\" class=\"nav-link\" href=\"index\"><i class=\"fas fa-home\"></i><span>Home</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"profilePage\" class=\"nav-link\" href=\"profile\"><i class=\"fas fa-user\"></i><span>Profile</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"purchasehistoryPage\" class=\"nav-link\" href=\"purchasehistory\"><i class=\"fas fa-receipt\"></i><span>Purchase History</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"patientsummaryPage\" class=\"nav-link\" href=\"patientsummary\"><i class=\"fas fa-user-circle\"></i><span>Patient Summary</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"productlistPage\" class=\"nav-link\" href=\"productlist\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
      break;
    case 'admin':
      r[++j] = "<li class=\"nav-item\"><a id=\"dashboardPage\" class=\"nav-link\" href=\"dashboard\"><i class=\"far fa-chart-bar\"></i><span>Statistics</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"productlistPage\" class=\"nav-link\" href=\"productlist\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"stockPage\" class=\"nav-link\" href=\"stock\"><i class=\"fas fa-bullseye\"></i><span>Stock</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"transactionlogPage\" class=\"nav-link\" href=\"transactionlog\"><i class=\"fas fa-receipt\"></i><span>Transaction Log</span></a></li>";
      r[++j] = "<li class=\"nav-item\"><a id=\"usermanagementPage\" class=\"nav-link\" href=\"usermanagement\"><i class=\"fas fa-users\"></i><span>User Management</span></a></li>";
      break;
    default:
      return;
  }
  $("#accordionSidebar").html(r.join(""));
  addActive();
}

function addActive() {
  var id = "#" + window.location.pathname.split("/").pop() + "Page";
  $(id).addClass("active");
}