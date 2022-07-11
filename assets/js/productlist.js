var medication;
var shoppingCart;

$(function () {
    setEvents();
    fetchMedicationList();
    setUpCart();
})

function setEvents() {
    $(document).on("click", ".cart-link", function () {
        if (medication[medication.findIndex(x => x.medication_id === this.id.substring(9))].isOTC == "yes")
            addToCart(this.id.substring(9));
        else
            handleAddPres(this.id.substring(9));
    })

    $(document).on("click", ".details-link", function () {
        getMedDetails(this.id.substring(10));
    })
}

function setUpCart() {
    if (sessionStorage.getItem("shoppingCart") === null) {
        shoppingCart = [];
    } else {
        shoppingCart = JSON.parse(sessionStorage.getItem("shoppingCart"))
    }
}

function populateMedication(prescriptions) {
    var r = new Array(), j = -1;
    for (var i = 0; i < medication.length; i++) {
        var pIndex = prescriptions.findIndex(x => x.medication_id === medication[i].medication_id);
        r[++j] = "<div class=\"col portfolio-item ";
        if (medication[i].isOTC == "yes")
            r[++j] = "filter-otc";
        else
            r[++j] = "filter-pres";
        r[++j] = " col-lg-4 col-md-4 col-sm-6 px-2 mb-4\"><img class=\"img-fluid rounded-1\" src=\"assets/img/medication/";
        r[++j] = medication[i].medication_id;
        r[++j] = ".jpg\"><div class=\"portfolio-info";
        if (medication[i].isOTC == "no" && pIndex == -1)
            r[++j] = " noPres";
        else if (medication[i].isOTC == "no" && (prescriptions[pIndex].quantity == prescriptions[pIndex].used_quantity))
            r[++j] = " noPres";
        else if (medication[i].isOTC == "no" && (prescriptions[pIndex].quantity > prescriptions[pIndex].used_quantity))
            r[++j] = " yesPres";
        r[++j] = "\"><h4>";
        r[++j] = medication[i].medication_name;
        r[++j] = "</h4><p>";
        r[++j] = parseInt(medication[i].price).toLocaleString('en-US') + " LBP";
        r[++j] = "</p><a class=\"portfolio-lightbox cart-link\" id=\"addToCart";
        r[++j] = medication[i].medication_id;
        r[++j] = "\" href=\"javascript:void(0)\"><i class=\"fas fa-shopping-cart\"></i></a><a class=\"details-link\" id=\"medDetails"
        r[++j] = medication[i].medication_id;
        r[++j] = "\" href=\"javascript:void(0)\"><i class=\"fas fa-info-circle\"></i></a></div></div>";
    }
    $("#medPage").html(r.join(""));
}

function fetchMedicationList() {
    postData("assets/php/selectProducts.php", "")
        .then(data => {
            medication = data;
            checkPrescription();
        })
}

function getMedDetails(medication_id) {
    var index = medication.findIndex(x => x.medication_id === medication_id)
    if (medication[index].contraindications == null) {
        var contraindications = "None";
    } else {
        var contraindications = medication[index].contraindications.replaceAll(", ", "<br/>");
    }
    $("#modal1Title").text(medication[index].medication_name);
    $("#detailsActive").text(medication[index].active_ingredient);
    $("#detailsIngredients").html(medication[index].ingredients.replaceAll(", ", "<br/>"));
    $("#detailsContra").html(contraindications);
    $("#detailsDose").text(medication[index].dosage);
    $("#detailsPrice").text(parseInt(medication[index].price).toLocaleString() + " LBP");
    $("#detailsOTC").text(medication[index].isOTC);
    $("#detailsUPP").text(medication[index].units_per_package);
    $("#detailsLeaflet").attr("href", medication[index].leaflet);
    $("#modal-1").modal('toggle');
}

function addToCart(medication_id) {
    if (shoppingCart.findIndex(x => x.medication_id === medication_id) == -1) {
        shoppingCart.push({ 'medication_id': medication_id, 'quantity': 1 })
    } else {
        var i = shoppingCart.findIndex(x => x.medication_id === medication_id);
        shoppingCart[i].quantity++;
    }
    sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart))
    successToast("Added To Cart")
    setCartNumber();
}

function checkPrescription() {
    var details = {
        'today': new Date().toISOString().substring(0, 10),
        'token': getCookie("sessionToken")
    };
    postData("assets/php/checkPrescription.php", prepareData(details))
        .then(data => {
            populateMedication(data);
        });
}

function handleAddPres(medication_id) {
    var details = {
        'today': new Date().toISOString().substring(0, 10),
        'token': getCookie("sessionToken")
    };
    postData("assets/php/checkPrescription.php", prepareData(details))
        .then(prescriptions => {
            var pIndex = prescriptions.findIndex(x => x.medication_id === medication_id);
            if (pIndex == -1)
                failureToast("You need a prescription for this medication");
            else if (prescriptions[pIndex].quantity == prescriptions[pIndex].used_quantity)
                failureToast("You need a prescription for this medication");
            else
                addToCart(medication_id);
        });
}