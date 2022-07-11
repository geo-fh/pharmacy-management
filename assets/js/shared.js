var shown = false;

$(function () {
    if (this.location.pathname != "/pharmacy-management/register.html" && this.location.pathname != "/pharmacy-management/login.html")
        verifySession();
    setSharedEvents();
    setCartNumber();
})

function setSharedEvents() {
    $(document).on("click", "#signOutBtn", function () {
        leaveSession();
    })
}

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

function getDate(date) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function populateSidebar(usertype) {
    var r = new Array(), j = -1;
    switch (usertype) {
        case '1':
            r[++j] = "<li class=\"nav-item\"><a id=\"dashboardPage\" class=\"nav-link\" href=\"dashboard\"><i class=\"far fa-chart-bar\"></i><span>Dashboard</span></a></li>";
            r[++j] = "<li class=\"nav-item\"><a id=\"patientcarePage\" class=\"nav-link\" href=\"patientcare\"><i class=\"fas fa-user-circle\"></i><span>Patient Care</span></a></li>";
            r[++j] = "<li class=\"nav-item\"><a id=\"productlistPage\" class=\"nav-link\" href=\"productlist\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
            r[++j] = "<li class=\"nav-item\"><a id=\"stockPage\" class=\"nav-link\" href=\"stock\"><i class=\"fas fa-bullseye\"></i><span>Stock</span></a></li>";
            r[++j] = "<li class=\"nav-item\"><a id=\"transactionlogPage\" class=\"nav-link\" href=\"transactionlog\"><i class=\"fas fa-receipt\"></i><span>Transaction Log</span></a></li>";
            break;
        case '3':
            setCartNumber();
            r[++j] = "<li class=\"nav-item\"><a id=\"indexPage\" class=\"nav-link\" href=\"index\"><i class=\"fas fa-home\"></i><span>Home</span></a></li>";
            r[++j] = "<li class=\"nav-item\"><a id=\"purchasehistoryPage\" class=\"nav-link\" href=\"purchasehistory\"><i class=\"fas fa-receipt\"></i><span>Purchase History</span></a></li>";
            r[++j] = "<li class=\"nav-item\"><a id=\"patientsummaryPage\" class=\"nav-link\" href=\"patientsummary\"><i class=\"fas fa-user-circle\"></i><span>Patient Summary</span></a></li>";
            r[++j] = "<li class=\"nav-item\"><a id=\"productlistPage\" class=\"nav-link\" href=\"productlist\"><i class=\"fas fa-bullseye\"></i><span>Products</span></a></li>";
            break;
        case '2':
            r[++j] = "<li class=\"nav-item\"><a id=\"dashboardPage\" class=\"nav-link\" href=\"dashboard\"><i class=\"far fa-chart-bar\"></i><span>Dashboard</span></a></li>";
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

function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function verifySession() {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/verifyToken.php", prepareData(details))
        .then(data => {
            populateSidebar(data[0].user_type)
            removeUnnecessary(data[0].user_type)
            $("#navBarUName").text(data[0].full_name)
        });
}

function leaveSession() {
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/removeSession.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                window.location.href = 'login';
            }
        });
}

function saveSession(token) {
    document.cookie = "sessionToken=" + token;
}

function validateEmail(email) {
    const regex = new RegExp("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$");
    return (regex.exec(email) != null);
}

function validateMobile(mobile) {
    const regex = new RegExp("^((([0][3])|([7][0])|([7][1])|([7][6])|([7][8])|([7][9])|([8][1]))[0-9]{6})$");
    return (regex.exec(mobile.trim()) != null);
}

function validateName(name) {
    const regex = new RegExp("^([A-Za-z]{2,}([\\s]?[A-Za-z]{2,})*)$");
    return (regex.exec(name) != null);
}

function successToast(text) {
    const progress = $(".progress");
    var toastElement = new bootstrap.Toast($("#customToast"), { animation: true, delay: 2000 });
    $("#toastSymbol").removeClass("fa-times failure");
    $("#toastSymbol").addClass("fa-check success");
    $("#toastMessage1").removeClass("failure");
    $("#toastMessage1").addClass("success");
    $("#toastMessage1").text("Success");
    $("#toastMessage2").text(text);
    if (!shown) {
        shown = true;
        toastElement.show();
        progress.addClass("active");
        let timer;
        timer = setTimeout(() => {
            progress.removeClass("active");
            shown = false;
        }, 2300);
    }
}

function failureToast(text) {
    const progress = $(".progress");
    var toastElement = new bootstrap.Toast($("#customToast"), { animation: true, delay: 2000 });
    $("#toastSymbol").removeClass("fa-check success");
    $("#toastSymbol").addClass("fa-times failure");
    $("#toastMessage1").removeClass("success");
    $("#toastMessage1").addClass("failure");
    $("#toastMessage1").text("Failure");
    $("#toastMessage2").text(text);
    if (!shown) {
        shown = true;
        toastElement.show();
        progress.addClass("active");
        let timer;
        timer = setTimeout(() => {
            progress.removeClass("active");
            shown = false;
        }, 2300);
    }
}

function codifyCountry(mobile) {
    var phone = mobile.toString().replaceAll(" ", "");
    if (phone[0] == "0")
        return "+961 " + phone.substring(1, 2) + " " + phone.substring(2, 5) + " " + phone.substring(5, 8);
    else
        return "+961 " + phone.substring(0, 2) + " " + phone.substring(2, 5) + " " + phone.substring(5, 8);
}

function removeUnnecessary(user_type) {
    if (user_type != 3 && window.location.pathname == "/pharmacy-management/productlist") {
        $(".cart-link").remove();
    }

    if (user_type != 3 && window.location.pathname == "/pharmacy-management/profile") {
        $("#additionalPatientInfo").remove();
    }

    if (user_type != 3 && window.location.pathname != "/pharmacy-management/login" && window.location.pathname != "/pharmacy-management/register") {
        $("#cartIcon").remove();
    }
}

function setCartNumber() {
    if (sessionStorage.getItem("shoppingCart") === null || JSON.parse(sessionStorage.getItem("shoppingCart")).length == 0) {
        $("#cartQt").text("0")
    } else {
        $("#cartLink").prop("href", "shoppingcart");
        $("#cartQt").text(JSON.parse(sessionStorage.getItem("shoppingCart")).length)
    }
}