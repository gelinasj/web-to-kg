import React from 'react';
import ReactDOM from 'react-dom';
import Injestor from "./view/injestor/components/Injestor.js";
import $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.min.css';

console.log("test");

const INPUT = [
  ["name", "height", "country", "first ascent"],
  ["everest", "29029", "Nepal", "1953"],
  ["denal", "20310", "United States", "1906"],
  ["Kilim", "19341", "Tanzania", "1889"],
  ["K2", "28251", "Pakistan", "1954"],
  ["Aconcagua", "22838", "Argentina", "1897"]
];

// const script1 = document.createElement("script1");
// script1.async = true;
// script1.src = "./jquery.js";
// document.head.appendChild(script1);
// const script2 = document.createElement("script2");
// script2.async = true;
// script2.src = "./jquery-ui.js";
// document.head.appendChild(script2);
// const $ = window.jQuery;
$.ajax({
    dataType: "html",
    url: chrome.runtime.getURL("popup.html"),
    success: (html) => {
      console.log("html", html);
      var div = $(html);
      document.body.insertBefore(div[0], document.body.lastChild.nextSibling);
      var width = 500;
      var height = 1000;

      // and let's actually make it a dialog
      div.dialog(
        {
          title: "Injestor",
          width: width,
          height: height,
          position: {my: "left top", at: "left top", collision: "none"}
        });
    }
})




// let popup_open = false;
//
// function openPopup(state) {
//     console.log("openPopup");
//     if (!popup_open){
//       var div = $("<div id='injestor'></div>");
//       document.body.insertBefore(div[0], document.body.lastChild.nextSibling);
//       ReactDOM.render(
//         <React.StrictMode>
//           <Injestor rawTableData={INPUT}/>
//         </React.StrictMode>,
//         document.getElementById("injestor")
//       );
//     }
//     chrome.runtime.sendMessage({ispopupopen: true});
// }
//
// chrome.runtime.onMessage.addListener(
// function(request, sender, sendResponse) {
//   console.log(request, sender);
//   if (request.open_popup){
//     openPopup(request.state);
//   }
// });
