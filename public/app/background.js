/*global chrome*/
/*global wdk*/
/*global $*/

function requestDataFunc(currentTypedString){
  return new Promise((resolve, reject) => {
    if(currentTypedString) {
        const url = wdk.searchEntities(currentTypedString, undefined, 5);
        return $.ajax({
            dataType: "json",
            url: url,
            success: resolve
        });
    } else {resolve(undefined)}
  });
}

function getEntities(ids) {
  console.log(ids);
  const url = wdk.getEntities(ids, ['en'], []);
  return fetch(url)
  .then(response => response.json())
  .then(wdk.parse.wd.entities);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type === "autocomplete") {
      requestDataFunc(request.data).then(sendResponse)
    } else if (request.type === "id_search"){
      getEntities(request.data).then(sendResponse)
    }
    return true
  }
);

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
   // Send a message to the active tab
   chrome.tabs.query({active: true, currentWindow:true},function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
   });
});
