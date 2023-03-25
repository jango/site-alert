String.prototype.ReplaceAll = function(stringToFind,stringToReplace){
    var temp = this;
    var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    };


chrome.storage.local.get("locations",  function(result){
  console.log("Loaded page: " + document.URL);

  for (var i = 0; i < result.locations.length; i++) {
    var re_str_url =  result.locations[i].url.ReplaceAll("*", '[\\s\\S]+?')
    var re_url = new RegExp(re_str_url, "g");

    match_result = re_url.test(document.URL);

    console.log("Checked against: " + re_url);
    console.log(match_result);

    if (match_result && typeof result.locations[i].contents != 'undefined' && result.locations[i].contents != ''){
      var re_str_contents =  result.locations[i].contents.ReplaceAll("*", '[\\s\\S]+?')
      var re_contents = new RegExp(re_str_contents, "g");

      console.log("Checking against the page contents regex as well: " + re_contents);
      match_result = re_contents.test($("html").html());      
      console.debug(match_result);
    }

    if (match_result){
          var sidebar;
          sidebar = $("<div id='sidebar'><table><tr>" +
                      "<td class=\"notification\">" + result.locations[i].alert + "</td>" +
                      "<td class=\"close-btn\">&#10006;</td>" +
                      "<tr></table></div>");
          sidebar.css({
            'position': 'fixed',
            'right': '0px',
            'top': '0px',
            'z-index': 9999,
            'width': '100%',
            'height': '50px',
            'background-color': 'rgba(255,0,0,0.7)',
            'text-align': 'center',
            'display': 'table',
            'pointer-events': 'none'
          });

          sidebar.find('table').css({
            'height': '100%',
            'width': '100%',
            'vertical-align': 'middle'
          });

          sidebar.find('td').css({
            'height': '100%',
            'color': 'white',
            'text-align': 'center',
            'font-weight': 'bold',
            'font-size': 'large',
          });

          sidebar.find('.notification').css({
            'width': '90%'
          });

          sidebar.find('.close-btn').css({
            'font-size': 'x-large',
            'cursor': 'pointer',
            'pointer-events': 'all'
          });


          sidebar.find('.close-btn').click(function() {
            sidebar.remove();
          });

          $('body').append(sidebar);

          break;
      }
  }
});