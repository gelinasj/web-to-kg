

// control what happens when user clicks icon
chrome.browserAction.onClicked.addListener(function(tab){
  console.log(tab);
  var msg = triggerPopupInNewTab(tab.id, 0); // send to top-level frame!  only want to open popup in top-level frame
});

function triggerPopupInNewTab(tabid, frameid, msg=null){
  if (!msg){
    msg = {open_popup: true};
  }
  chrome.tabs.sendMessage(tabid, msg, {frameId: frameid});
  return msg;
}
