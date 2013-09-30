function delete_alert(button){
    // Remove record from storage.
    var new_locations = new Array(0);
    var tr = jQuery(button).parent().parent();

    chrome.storage.local.get("locations",  function(result){
        for (var i = 0; i < result.locations.length; i++) {
            if (result.locations[i].url != tr.find("td:first-child").text()){
                new_locations.push(result.locations[i]);
            }
        }
        chrome.storage.local.set({'locations': new_locations});
    });

    // Remove TR.
    tr.remove();
}

function add_alert(url, contents, text, enabled){
    tr = jQuery("#alerts").append("<tr><td>"  + url + "</td>" +
                             "<td>" + contents + "</td>" +
                             "<td>" + text + "</td>" +
                             "<td><button class=\"delete_alert\" type=\"button\">Delete</button></td></tr>");

    tr.find(".delete_alert").click(function() {delete_alert(this);});
}


function restore_settings(settings){
    // List existing alerts.
    container = jQuery(settings.manifest.existingAlerts.element).parent();
            container.append("<table id=\"alerts\"><tr><th>Alert URL</th><th>Page Contents</th><th>Alert Text</th><th></th></tr></table>");

    chrome.storage.local.get("locations",  function(result){
        if (typeof result.locations == 'object' && result.locations instanceof Array){
            for (var i = 0; i < result.locations.length; i++) {
                if (typeof result.locations[i].contents == 'undefined'){
                    result.locations[i].contents = "";
                }
                add_alert(result.locations[i].url, result.locations[i].contents, result.locations[i].alert, false);
            }
        }
    });

}

window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        // Restore settings.
        restore_settings(settings);

        // When "Add Alert" button is clicked.
        settings.manifest.addAlert.addEvent("action", function () {

            site_url = jQuery(settings.manifest.site_url.element).val();
            site_contents = jQuery(settings.manifest.site_contents.element).val();
            site_alert = jQuery(settings.manifest.site_alert.element).val();

            chrome.storage.local.get("locations",  function(result){
                console.log(result);

                if (typeof result.locations != 'object' || !(result.locations instanceof Array)){
                    locations = new Array();
                } else {
                    locations = result.locations;
                }

                for (var i = 0; i < locations.length; i++) {
                    if (locations[i].url == site_url){
                        alert("Alert for this URL already exists.");
                        return;
                    }
                }
                // TODO: avoid pushing the same URL twice.
                locations.push({'url':site_url,
                                'contents': site_contents,
                                'alert': site_alert,
                                'enabled': true});
                chrome.storage.local.set({'locations': locations});

                // Add to the table.
               add_alert(site_url, site_contents, site_alert, false);

              });
        });
    });
});
