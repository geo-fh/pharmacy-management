var baseUsers, users, stringUsers;
var search;
var usersProcessed = false;
var currentPage = 1;
var sortDirection = [0, 0, 0, 0, 0]; // 0 is unset, 1 is ascending, 2 is descending
var columns = ["user_id", "user_type", "email_address", "full_name", "sign_up_date"];
var columnTypes = ["Number", "String", "String", "String", "Date"];

$(function () {
    fetchUsers();
    setNeutralArrows();
    setEvents();
})

function setEvents() {
    $(document).on("click", "#userPagination > li.page-item", function () {
        switch (this.id) {
            case "previousPage":
                if (currentPage > 1)
                    currentPage--;
                break;
            case "nextPage":
                if (currentPage < 5)
                    currentPage++;
                break;
            default:
                currentPage = this.id.substr(4);
        }
        displayUsers();
    })

    $(document).on("change", "#selectedLimit", function () {
        currentPage = 1;
        displayUsers();
    })

    $(document).on("click", ".tablesorter > thead > tr > th", function () {
        if (this.id != "")
            sortColumn(this.id);
    })

    $(document).on("input", "#userSearch", function (e) {
        if (e.target.value == "")
            users = baseUsers;
        else
            searchUsers(e.target.value);
        displayUsers();
    })

    $(document).on("click", ".userManage", function() {
        var user_id = $(this).parentsUntil("tbody").children("td")[0].firstChild.data;
        displayManageModal(user_id);
    })

    $(document).on("click", "#submitManage", function() {
        submitManage();
    })
}

function fetchUsers() {
    postData("assets/php/selectUsers.php", "")
        .then(data => {
            baseUsers = fixUserType(data);
            users = baseUsers;
            displayUsers();
        });
}

function displayUsers() {
    var limit = $("#selectedLimit option:selected").val();
    var start = (currentPage - 1) * limit;
    var end = Math.min(parseInt(start) + parseInt(limit), users.length);
    if (end > start)
        $("#dataTable_info").html(`Showing ${start + 1} to ${end} of ${users.length}`);
    else
        $("#dataTable_info").html("No results found");
    populateUsers(start, end);
    updatePagination(currentPage);
}

function populateUsers(start, end) {
    var r = new Array(), j = -1;
    for (var i = start; i < end; i++) {
        r[++j] = "<tr><td>";
        r[++j] = users[i].user_id;
        r[++j] = "</td><td>";
        r[++j] = users[i].user_type;
        r[++j] = "</td><td>";
        r[++j] = users[i].email_address;
        r[++j] = "</td><td>";
        r[++j] = users[i].full_name;
        r[++j] = "</td><td>";
        r[++j] = getDate(new Date(users[i].sign_up_date));
        r[++j] = "</td><td>";
        r[++j] = "<button class=\"btn btn-primary userManage\" type=\"button\">Manage</button>";
        r[++j] = "</td></tr>";
    }
    $("#userList").html(r.join(""));
}

function fixUserType(array) {
    for(i in array) {
        switch(array[i].user_type) {
            case "1":
                if(array[i].activated == 1)
                    array[i].user_type = "Pharmacist";
                else
                    array[i].user_type = "Pharmacist (Pending)";
                break;
            case "2":
                array[i].user_type = "Admin";
                break;
            case "3":
                array[i].user_type = "Patient";
                break;
            default:
                array[i].user_type = "Unknown";
        }
    }
    return array;
}

function updatePagination(currentPage) {
    var limit = $("#selectedLimit option:selected").val();
    var size = users.length;
    var pages = Math.ceil(size / limit);
    var r = new Array(), j = -1;
    r[++j] = "<li class=\"page-item\"";
    if (currentPage == 1)
        r[++j] = " hidden=\"true\"";
    r[++j] = "id=\"previousPage\"><a class=\"page-link\" aria-label=\"Previous\" href=\"javascript:void(0)\"><span aria-hidden=\"true\">«</span></a></li>";
    for (var i = 1; i <= pages; i++) {
        r[++j] = "<li class=\"page-item";
        if (i == currentPage)
            r[++j] = " active";
        r[++j] = "\"id=\"page"
        r[++j] = i;
        r[++j] = "\"><a class=\"page-link\" href=\"javascript:void(0)\">";
        r[++j] = i;
        r[++j] = "</a></li>";
    }
    r[++j] = "<li class=\"page-item\""
    if (currentPage == pages)
        r[++j] = " hidden=\"true\"";
    r[++j] = "id=\"nextPage\"><a class=\"page-link\" aria-label=\"Next\" href=\"javascript:void(0)\"><span aria-hidden=\"true\">»</span></a></li>"
    $("#userPagination").html(r.join(""));
}

function sortColumn(columnName) {
    var index = columns.indexOf(columnName);
    var type = columnTypes[index]
    switch (type) {
        case 'Number':
            if (sortDirection[index] != 1) {
                users.sort((a, b) => parseInt(a[columnName]) - parseInt(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                users.sort((a, b) => parseInt(b[columnName]) - parseInt(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'String':
            if (sortDirection[index] != 1) {
                users.sort((a, b) => a[columnName].localeCompare(b[columnName]));
                resetSortDirection(index, 1);
            } else {
                users.sort((a, b) => b[columnName].localeCompare(a[columnName]));
                resetSortDirection(index, 2);
            }
            break;
        case 'Date':
            if (sortDirection[index] != 1) {
                users.sort((a, b) => (new Date(a[columnName])).getTime() - (new Date(b[columnName])).getTime());
                resetSortDirection(index, 1);
            } else {
                users.sort((a, b) => (new Date(b[columnName])).getTime() - (new Date(a[columnName])).getTime());
                resetSortDirection(index, 2);
            }
            break;
        default:
            return;
    }
    displayUsers();
}

function resetSortDirection(index, dir) {
    sortDirection = [0, 0, 0, 0, 0];
    if (dir == 1) {
        sortDirection[index] = 1;
    } else if (dir == 2) {
        sortDirection[index] = 2;
    }
    sortArrows();
}

function setNeutralArrows() {
    for (var i = 0; i < columns.length; i++) {
        $('#' + columns[i]).addClass("header");
    }
}

function sortArrows() {
    for (var i = 0; i < sortDirection.length; i++) {
        switch (sortDirection[i]) {
            case 0:
                $('#' + columns[i]).removeClass("headerSortUp");
                $('#' + columns[i]).removeClass("headerSortDown");
                break;
            case 1:
                $('#' + columns[i]).addClass("headerSortUp");
                $('#' + columns[i]).removeClass("headerSortDown");
                break;
            case 2:
                $('#' + columns[i]).addClass("headerSortDown");
                $('#' + columns[i]).removeClass("headerSortUp");
                break;
            default:
                return;
        }
    }
}

function searchUsers(text) {
    var index = 0;
    search = [];
    if (!usersProcessed)
        stringifyUsers();
    for (key in stringUsers) {
        var string = stringUsers[key].toLowerCase();
        if (string.includes(text.toLowerCase())) {
            search[index] = baseUsers[key];
            index++;
        }
    }
    users = search;
}

function stringifyUsers() {
    stringUsers = [];
    for (key in users) {
        var string = "";
        for (column in columns) {
            string += users[key][columns[column]]
            if (columns[column] == "sign_up_date") {
                string += " ";
                string += getDate(new Date(users[key][columns[column]]));
            }
            if (column < columns.length)
                string += " ";
        }
        stringUsers[key] = string;
    }
    usersProcessed = true;
}

function displayManageModal(user_id) {
    $("#modalTitle").text("User #" + user_id);
    getDetails(user_id);
    $("#modal-1").modal("toggle");
}

function fillDetailsModal(details) {
    var checkbox = $("#activationStatus");
    $("#fullName").val(details[0].full_name);
    $("#newEmail").val(details[0].email_address);
    if(details[0].user_type != 1) {
        checkbox.prop("disabled", true);
        checkbox.prop("checked", true);
    } else {
        checkbox.removeAttr("disabled");
        if(details[0].activated == 1) {
            checkbox.prop("checked", true);
        }
        else {
            checkbox.prop("checked", false);
        }
    }
}

function getDetails(user_id) {
    var details = {
        'user_id': user_id
      };
      postData("assets/php/selectUserInfo.php", prepareData(details))
        .then(data => {
            fillDetailsModal(data);
        });
}

function submitManage() {
    console.log($("#newEmail").val());
    console.log($("#newPassword").val());
    console.log($("#activationStatus")[0].checked);
}