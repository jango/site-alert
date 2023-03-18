function render_alert_table() {
    $("#alerts tbody tr").remove();

    chrome.storage.local.get("locations", function (result) {
        if (typeof result.locations == 'object' && result.locations instanceof Array) {
            for (var i = 0; i < result.locations.length; i++) {
                if (typeof result.locations[i].contents == 'undefined') {
                    result.locations[i].contents = "";
                }
                add_alert_to_ui(result.locations[i].url, result.locations[i].contents, result.locations[i].alert, false);
            }
        }
    });
}

function add_alert_to_ui(url, contents, text) {

    tr = $("#alerts").append("<tr><td>" + url + "</td>" +
        "<td>" + contents + "</td>" +
        "<td>" + text + "</td>" +
        "<td>" +
        '<button type="button" class="btn btn-primary btn-edit-alert">Edit</button> ' +
        '<button type="button" class="btn btn-danger btn-delete-alert">Delete</button>' +
        '</td></tr>'
    );

    tr.find(".btn-delete-alert").click(function () { delete_alert(this); });
    tr.find(".btn-edit-alert").click(function () {
        openModal('Edit Alert');
        $("#site-url-field").val(url);
        $("#page-text-field").val(contents);
        $("#alert-text-field").val(text);
    });
}
function delete_alert(button) {
    // Remove record from storage.
    var new_locations = new Array(0);
    var tr = $(button).parent().parent();

    chrome.storage.local.get("locations", function (result) {
        for (var i = 0; i < result.locations.length; i++) {
            if (result.locations[i].url != tr.find("td:first-child").text()) {
                new_locations.push(result.locations[i]);
            }
        }
        chrome.storage.local.set({ 'locations': new_locations });
        render_alert_table();
    });

    
}

function add_alert(url, contents, text) {

    chrome.storage.local.get("locations", function (result) {
        if (typeof result.locations != 'object' || !(result.locations instanceof Array)) {
            locations = new Array();
        } else {
            locations = result.locations;
        }

        var alert_exists = false;
        for (var i = 0; i < locations.length; i++) {
            if (locations[i].url == url) {
                alert_exists = true;
            }
        }

        if (!alert_exists) {
            locations.push({
                'url': url,
                'contents': contents,
                'alert': text,
                'enabled': true
            });
            chrome.storage.local.set({ 'locations': locations });
        }
        render_alert_table();
    });
    
}


function openModal(title) {
    $('#myModal').modal('show');
}

function closeModal() {
    $('#myModal').modal('hide');
}

function restore_settings() {
    chrome.storage.local.get("locations", function (result) {
        if (typeof result.locations == 'object' && result.locations instanceof Array) {
            for (var i = 0; i < result.locations.length; i++) {
                if (typeof result.locations[i].contents == 'undefined') {
                    result.locations[i].contents = "";
                }
                add_alert(result.locations[i].url, result.locations[i].contents, result.locations[i].alert, false);
            }
        }
    });
}


$(document).ready(function () {
    render_alert_table();

    $("#add-new-main-btn").click(function () {
        openModal('Add New Item');
    });



    $("#save-changes-btn").click(function () {
        add_alert($("#site-url-field").val(),
            $("#page-text-field").val(),
            $("#alert-text-field").val());

        $("#site-url-field").val("");
        $("#page-text-field").val("");
        $("#alert-text-field").val("");

        closeModal();
    });
});