this.manifest = {
    "name": "Visual Site Alert",
    "icon": "icon.png",
    "settings": [
        {
            "tab": "Site List",
            "group": "Add New Alert",
            "name": "myDescription",
            "type": "description",
            "text": "Site URL specifies the URL you want to match. You can use <strong>*</strong> as a wild card. \
            For example, <strong>http*://*.ca</strong> will match all sites in .ca domain. \
            Alert text specifies the text that will appear atop of the bar."
        },
        {
            "tab": "Site List",
            "group": "Add New Alert",
            "name": "site_url",
            "type": "text",
            "label": "Site URL",
            "text": "Example: http://google.*"
        },
        {
            "tab": "Site List",
            "group": "Add New Alert",
            "name": "site_alert",
            "type": "text",
            "label": "Alert Text",
            "text": "Example: Warning! You are now on google!"
        },
        {
            "tab": "Site List",
            "group": "Add New Alert",
            "name": "addAlert",
            "type": "button",
            "text": "Add Alert"
        },
        {
            "tab": "Site List",
            "group": "Existing Alerts",
            "name": "existingAlerts",
            "type": "description",
            "text": "Existing alerts."
        }
    ],
    "alignment": [
        [
            "site_url",
            "site_alert"
        ]
    ]
};
