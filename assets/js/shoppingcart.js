var shoppingCart, medication;
var insertedCount = 0;

$(function () {
    setEvents();
    fetchMedicationList();
    increaseUsedQuantity(9, 2)
})

function setEvents() {
    $(document).on("click", ".btn-close", function () {
        removeFromCart(this.id.substring(10));
    })

    $(document).on("click", ".btn-increase", function () {
        var quantity = $(this).parent().children()[1];
        if (quantity.value >= quantity.max && $(quantity).attr("max"))
            failureToast("You can't buy more of this")
        else
            increaseQuantity(this.id.substring(7))
    })

    $(document).on("click", ".btn-decrease", function () {
        if ($(this).parent().children()[1].value > 1)
            decreaseQuantity(this.id.substring(8))
    })

    $(document).on("click", "#placeOrder", function () {
        if (shoppingCart.length != 0)
            placeOrder();
    })
}

function fetchMedicationList() {
    postData("assets/php/selectProducts.php", "")
        .then(data => {
            medication = data;
            fetchCart();
        })
}

function fetchCart() {
    shoppingCart = JSON.parse(sessionStorage.getItem("shoppingCart"));
    shoppingCart.sort((a, b) => parseInt(a.medication_id) - parseInt(b.medication_id));
    fixCartQuantities();
}

function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
}

function populateCart() {
    var r = new Array(), j = -1;
    var total = 0;
    for (var i = 0; i < shoppingCart.length; i++) {
        var index = medication.findIndex(x => x.medication_id === shoppingCart[i].medication_id);
        r[++j] = "<tr><td><img src=\"assets/img/medication/";
        r[++j] = shoppingCart[i].medication_id;
        r[++j] = ".jpg\" style=\"max-width: 100px; max-height: 60px;\"></td><td>";
        r[++j] = medication[index].medication_name;
        r[++j] = "</td><td><div class=\"input-group\"><button id=\"minusBtn";
        r[++j] = shoppingCart[i].medication_id;
        r[++j] = "\" type=\"button\" class=\"btn btn-decrease\"><i class=\"fas fa-minus\"></i></button><input id=\"quantity";
        r[++j] = shoppingCart[i].medication_id;
        r[++j] = "\" min=\"1\" type=\"number\" class=\"form-control cartQt\" value=\"";
        r[++j] = shoppingCart[i].quantity;
        r[++j] = "\" disabled><button id=\"plusBtn";
        r[++j] = shoppingCart[i].medication_id;
        r[++j] = "\" type=\"button\" class=\"btn btn-increase\"><i class=\"fas fa-plus\"></i></button></div></td><td><button id=\"removeItem";
        r[++j] = shoppingCart[i].medication_id;
        r[++j] = "\" class=\"btn-sm btn-close\" type=\"button\"></button></td><td>";
        r[++j] = (medication[index].price * shoppingCart[i].quantity).toLocaleString();
        r[++j] = " LBP</td></tr>";
        total += medication[index].price * shoppingCart[i].quantity;
    }
    if (shoppingCart.length == 0) {
        $("#cartList").html("<tr><td colspan=\"5\">Your Shopping Cart is empty.</td></tr>");
        $("#totalPrice").text("");
    } else {
        $("#cartList").html(r.join(""));
        $("#totalPrice").text(total.toLocaleString() + " LBP")
    }
    fixMaxes();
}

function removeFromCart(medication_id) {
    shoppingCart.splice(shoppingCart.findIndex(x => x.medication_id === medication_id), 1);
    populateCart();
    saveCart();
    setCartNumber();
}

function increaseQuantity(medication_id) {
    var i = shoppingCart.findIndex(x => x.medication_id === medication_id);
    shoppingCart[i].quantity++;
    saveCart();
    populateCart();
}

function decreaseQuantity(medication_id) {
    var i = shoppingCart.findIndex(x => x.medication_id === medication_id);
    shoppingCart[i].quantity--;
    saveCart();
    populateCart();
}

function fixCartQuantities() {
    var details = {
        'today': new Date().toISOString().substring(0, 10),
        'token': getCookie("sessionToken")
    };
    postData("assets/php/checkPrescription.php", prepareData(details))
        .then(prescriptions => {
            for (var i = 0; i < shoppingCart.length; i++) {
                var pIndex = prescriptions.findIndex(x => x.medication_id === shoppingCart[i].medication_id);
                if (pIndex != -1) {
                    shoppingCart[i].quantity = Math.min(shoppingCart[i].quantity, prescriptions[pIndex].quantity - prescriptions[pIndex].used_quantity);
                }
            }
            saveCart();
            populateCart();
        });
}

function fixMaxes() {
    var details = {
        'today': new Date().toISOString().substring(0, 10),
        'token': getCookie("sessionToken")
    };
    postData("assets/php/checkPrescription.php", prepareData(details))
        .then(prescriptions => {
            for (var i = 0; i < shoppingCart.length; i++) {
                var pIndex = prescriptions.findIndex(x => x.medication_id === shoppingCart[i].medication_id);
                if (pIndex != -1) {
                    $("#quantity" + shoppingCart[i].medication_id).attr({ "max": prescriptions[pIndex].quantity - prescriptions[pIndex].used_quantity })
                }
            }
        });
}

function placeOrder() {
    var cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
    var total = 0;
    for (i in cart) {
        var index = medication.findIndex(x => x.medication_id === cart[i].medication_id);
        total += medication[index].price * cart[i].quantity;
    }
    var details = {
        'token': getCookie("sessionToken")
    };
    postData("assets/php/getPatientID.php", prepareData(details))
        .then(patient_id => {
            var details = {
                'patient_id': patient_id[0].patient_id,
                'purchase_date': new Date().toISOString().substring(0, 10),
                'total_price': total
            };
            postData("assets/php/placeOrder.php", prepareData(details))
                .then(order_id => {
                    if (order_id != "Error") {
                        for (var i = 0; i < cart.length; i++) {
                            var medication_id = cart[i].medication_id;
                            var index = medication.findIndex(x => x.medication_id === medication_id);
                            var quantity = cart[i].quantity;
                            var price = medication[index].price * quantity;
                            insertOrderMedication(order_id, medication_id, quantity, price)
                            decreaseStock(medication_id, quantity);
                            if (medication[index].isOTC == "no")
                                increaseUsedQuantity(medication_id, quantity);
                        }
                    }
                });
        });
}

function insertOrderMedication(order_id, medication_id, quantity, price) {
    var details = {
        'order_id': order_id,
        'medication_id': medication_id,
        'quantity': quantity,
        'price': price
    };
    postData("assets/php/insertIntoOrderMedication.php", prepareData(details))
        .then(data => {
            if (data != "Error") {
                insertedCount++;
                if (insertedCount == shoppingCart.length) {
                    sessionStorage.removeItem("shoppingCart");
                    successToast("Order placed successfully")
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                }
            }
        });
}

function increaseUsedQuantity(medication_id, quantity) {
    var details = {
        'today': new Date().toISOString().substring(0, 10),
        'token': getCookie("sessionToken")
    };
    postData("assets/php/checkPrescription.php", prepareData(details))
        .then(prescriptions => {
            var indices = [];
            for (i in prescriptions) {
                if (prescriptions[i].medication_id == medication_id)
                    indices.push(i)
            }
            for(i in indices) {
                
            }
        });
}

function decreaseStock(medication_id, quantity) {

}