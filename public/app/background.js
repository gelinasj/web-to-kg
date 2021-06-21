/*global chrome*/
/*global wdk*/
/*global $*/

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function formatPropertyQuery(currentTypedString) {
  return `SELECT DISTINCT ?label ?url
          WHERE
          {{
                ?url wdt:P31 wd:Q18616576;
                     rdfs:label ?label.
                FILTER (lang(?label) = "en").
                FILTER regex (?label, ".*${currentTypedString}.*")

          }
          UNION
          {
                ?url wdt:P31 ?propType;
                     rdfs:label ?label.
                {
                  {?propType wdt:P279 wd:Q18616576.}
                  UNION
                  {?propType wdt:P279 ?propClass1.
                   ?propClass1 wdt:P279 wd:Q18616576.}
                  UNION
                  {?propType wdt:P279 ?propClass1.
                   ?propClass1 wdt:P279 ?propClass2.
                   ?propClass2 wdt:P279 wd:Q18616576.}
                  UNION
                  {?propType wdt:P279 ?propClass1.
                   ?propClass1 wdt:P279 ?propClass2.
                   ?propClass2 wdt:P279 ?propClass3.
                   ?propClass3 wdt:P279 wd:Q18616576.}
                }
                FILTER (lang(?label) = "en").
                FILTER regex (?label, ".*${currentTypedString}.*")
          }}
          LIMIT 3`
}

function entityRequestDataFunc(currentTypedString){
  return new Promise((resolve, reject) => {
    if(currentTypedString) {
        const url = wdk.searchEntities(currentTypedString, undefined, 5);
        return $.ajax({
            dataType: "json",
            url: url,
            success: resolve
        });
    } else {resolve(undefined)}
  }).then((data) => data === undefined ? [] : data.search);
}

function connectionRequestDataFunc(currentTypedString){
  return new Promise((resolve, reject) => {
    if(currentTypedString) {
        const query = formatPropertyQuery(currentTypedString)
        const url = wdk.sparqlQuery(query)
        return $.ajax({
            dataType: "json",
            url: url,
            success: resolve
        });
    } else {resolve(undefined)}
  }).then((data) => {
    return data.results.bindings.map((result) => {
      return {
        id: result.url.value.match(/.*\/(P.*)$/)[1],
        label: result.label.value,
        url: result.url.value,
        description: ""
      };
    })
  });
}

function getEntities(ids) {
  const urls = wdk.getManyEntities(ids, ['en'], []);
  return Promise.all(urls.map(url =>
    fetch(url)
    .then(response => response.json())
    .then(wdk.parse.wd.entities)))
  .then(responses => {
    let mergedResponse = {}
    responses.forEach(response => {
      mergedResponse = {...mergedResponse, ...response}
    });
    return mergedResponse;
  });
}

async function getUserId(email, name) {
  const userData = await postData("http://localhost:5000/users", {email, name});
  return userData.id;
}

function arrOfArrToCsv(arrOfArr) {
  return arrOfArr.map(arr => arr.join()).join("\n")
}

async function createDataObject(userId, triples) {
  triples.unshift(["subject", "predicate", "object"])
  const csvData = $.csv.fromArrays(triples);
  const csv = `data:text/csv;charset=utf-8,${csvData}`
  const metadata = {
      'name': "Temporary Data Name (TODO)",
      'owner_id': userId,
      'description': "Temporary Data Description (TODO)",
      'comment': "Temporary Data Comment (TODO)",
      'datatype': '/datatypes/csv',
      // 'data': csv,
      'mimetype': 'text/csv',
      'predecessors': []
  };

  const formData = new FormData();
  var blob = new Blob([csv], {type: "text/csv"});
  formData.append("datafile", blob);
  var blob2 = new Blob([metadata], {type: "text/json"});
  formData.append("metadata", blob2);
  return await fetch(url, {
    method: 'POST',
    body: formData
  });

  // const formData = new FormData();
  // // formData.append("metadata", metadata);
  // formData.append("datafile", csv);
  // return await fetch('http://localhost:5000/dobjs', {
  //     method: 'POST',
  //     body: formData
  //   });
  // return await $.ajax({
  //   url: 'http://localhost:5000/dobjs',
  //   type: 'POST',
  //   processData: false, // important
  //   contentType: false, // important
  //   dataType : 'json',
  //   data: formData
  // });
  // var request = new XMLHttpRequest();
  // request.open("POST","http://localhost:5000/dobjs");
  // request.setRequestHeader("Content-type", "multipart/form-data");
  // return await request.send(formData);
  // chrome.downloads.download({url: csvLink, filename: "temp.csv"});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type === "autocomplete_Entity") {
      entityRequestDataFunc(request.data).then(sendResponse)
    } else if(request.type === "autocomplete_Connection") {
      connectionRequestDataFunc(request.data).then(sendResponse)
    } else if (request.type === "id_search"){
      getEntities(request.data).then(sendResponse)
    } else if (request.type === "get_user_id") {
      const [email, name] = request.data;
      getUserId(email, name).then(sendResponse)
    } else if (request.type === "create_data_object") {
      const [userId, triples] = request.data;
      createDataObject(userId, triples);
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
