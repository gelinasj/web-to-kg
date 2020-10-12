import wdk from "wikidata-sdk";
import $ from "jquery";


export function requestDataFunc(currentTypedString, handler){
    if(currentTypedString) {
        const url = wdk.searchEntities(currentTypedString);
        console.log(url);
        $.ajax({
            dataType: "json",
            url: url,
            success: handler
        });
    }
};


export function processReceivedDataFunc(data) {
    return data.search.map((item) => `${item.label} - ${item.description}`);
}
