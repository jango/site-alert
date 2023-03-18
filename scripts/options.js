/**
 * Refreshes the alert table based on the contents
 * of the storage.
 */
function render_alert_table() {
    $("#alerts tbody tr").remove();

    chrome.storage.local.get("locations", function (result) {
        if (typeof result.locations == 'object' && result.locations instanceof Array) {

            let sorted_locations = result.locations.sort(
                (l1, l2) => (l1.url > l2.url) ? 1 : (l1.url < l2.url) ? -1 : 0);

            for (var i = 0; i < sorted_locations.length; i++) {
                if (typeof result.locations[i].contents == 'undefined') {
                    result.locations[i].contents = "";
                }

                add_alert_to_ui(result.locations[i].url, result.locations[i].contents, result.locations[i].alert);
            }
        }
    };
}

/** 
 * Adds an alert entry into the table.
 */
function add_alert_to_ui(url, contents, text) {

    tr = $("#alerts").append("<tr><td>" + url + "</td>" +
        "<td>" + contents + "</td>" +
        "<td>" + text + "</td>" +
        "<td>" +
        '<button data-toggle="modal" data-url="' + url + '" type="button" class="btn btn-primary btn-edit-alert">Edit</button> ' +
        '<button data-toggle="modal" data-url="' + url + '" type="button" class="btn btn-danger btn-delete-alert">Delete</button>' +
        '</td></tr>'
    );

    tr.find(".btn-delete-alert").last().click(function () { delete_alert(url); });
    tr.find(".btn-edit-alert").last().click(function () {
        $("#site-url-field").val(url);
        $("#page-text-field").val(contents);
        $("#alert-text-field").val(text);
        $("#myModal").data("url", url);
        $('#myModal').modal('show');
    });
}

const delete_alert = async (url) => {
    return new Promise((resolve, reject) => {
        var new_locations = new Array(0);

        chrome.storage.local.get("locations", function (result) {
            for (var i = 0; i < result.locations.length; i++) {
                if (result.locations[i].url != url) {
                    new_locations.push(result.locations[i]);
                }
            }
            chrome.storage.local.set({ 'locations': new_locations });

            render_alert_table();
            resolve();
        });
    });
};

const add_alert = async (url, contents, text) => {
    return new Promise((resolve, reject) => {
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
            resolve();
        });
    });
};



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
        $('#myModal').modal('show');
    });

    $("#save-changes-btn").click(async function () {
        url = $("#myModal").data('url')
        console.log(url);

        await delete_alert(url);

        await add_alert($("#site-url-field").val(),
            $("#page-text-field").val(),
            $("#alert-text-field").val());

        $("#site-url-field").val("");
        $("#page-text-field").val("");
        $("#alert-text-field").val("");
        $("#myModal").data("url", undefined);

        $('#myModal').modal('hide');
    });
});