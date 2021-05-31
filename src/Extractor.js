/*global $*/
import React from "react";
// import $ from 'jquery';
// import 'jquery-ui';
//import "jquery-csv";

// const INPUT = [
//   ["name", "height", "country", "first ascent"],
//   ["everest", "29029", "Nepal", "1953"],
//   ["denal", "20310", "United States", "1906"],
//   ["Kilim", "19341", "Tanzania", "1889"],
//   ["K2", "28251", "Pakistan", "1954"],
//   ["Aconcagua", "22838", "Argentina", "1897"]
// ];

const popuptext = `
<div id="data_demo_frame">
<div id="download-interaction-mode">
  <p>First, download your data.  Use CSV format.  Drag it into the box below when you're ready!</p>
  <input type='file' id="file-selector" accept='csv'>
  <div class="mode-switch">
    <p>No CSV download option?</p>
    <button id='switch-to-demo'>Click here to enter data demonstration mode instead</button>
  </div>
</div>
<div id="demonstration-interaction-mode" style="display: none">
  <p>Go ahead and start clicking on parts of the webpage that should be cells in your table of data.</p>
  <div class="mode-switch">
    <p>You're in data demonstration mode, but if you find a way to download the data as a CSV, you can just use that.</p>
    <button id='switch-to-download'>Click here to load CSV data instead</button>
  </div>
</div>
<div id='csv-data'></div>
</div>
`;

export default class Extractor extends React.Component {
  constructor(props) {
    super(props)
    this.divId = "kg-tool"
  }

  componentDidMount() {
    const extractorDiv = $(this.props.document.getElementById(this.divId))
    this.runExtractor(extractorDiv)
  }

  componentWillUnmount() {
    $(this.props.document.getElementById(this.divId)).remove();
  }

  render() {
    return <div id="filler"><div id={this.divId}/></div>
  }

  runExtractor(div){
      // go ahead and make the dialog
      var dialogdiv  = $(popuptext);
      this.buttonize(dialogdiv.find("#switch-to-demo"), this.switchToDemo.bind(this));
      this.buttonize(dialogdiv.find("#switch-to-download"), this.switchToDownload.bind(this));
      div.append(dialogdiv);

      // set up handlers for the file uploading interaction

      var fileDragArea = div.find("#file-selector");
      fileDragArea.on("change", this.processNewUploadedTableEvent.bind(this));
      // some appearance things for the file uploading interaction, just highlighting in blue
      fileDragArea.on("dragenter", change);
      fileDragArea.on("dragleave", change_back);
      function change() {
        fileDragArea.css("background-color", '#4688F4');
      };
      function change_back() {
        fileDragArea.css("background-color", 'inherit');
      };

      var width = 500;
      var height = 1000;

  }

  buttonize(elem, handler){
    //elem.button();
    elem.click(handler);
  }

  switchToDemo(){
    $("#download-interaction-mode").css("display", "none");
    $("#demonstration-interaction-mode").css("display", "default");
    setTimeout(this.setUpDemoMode.bind(this),0); // schedule it for right after this handler, so that this click doesn't get counted as a demo click
  }

  switchToDownload(){
    $("#download-interaction-mode").css("display", "default");
    $("#demonstration-interaction-mode").css("display", "none");
  }

  setUpDemoMode(){
    var that = this;

    var inDemoMode = true;

    var demoClick = function(event){

      if (inDemoMode){
        // normally a click might cause something to happen, like following a link
        // during demo mode we want to prevent that default behavior
        event.preventDefault();
        event.stopPropagation();
        var node = event.target;
        // remember, we're assuming it's a cell in a table
        var table = $(node).closest("table");
        var arrayOfArrays = [];
        var targetRowLength = null;
        table.find("tr").each(function (i, row) {
            var rowArray = [];
            $(this).find("td, th").each(function(i, cell){
                var text = cell.textContent;
                var numRepetitions = 1;
                // take a look at wikipedia list of tallest mountains for an example of where colspan matters
                // have to line up the headers with the rows
                // todo: do something even more robust for this issue?
                if (cell.colSpan && cell.colSpan > 1){
                  numRepetitions = cell.colSpan;
                }
                var nextSegment = Array(numRepetitions).fill(text);
                rowArray = rowArray.concat(nextSegment);
            });
            if (targetRowLength === null){
              targetRowLength = rowArray.length;
            }
            if (rowArray.length === targetRowLength){
              arrayOfArrays.push(rowArray);
            }
            // for now, just throw away rows that are the wrong length (don't match the length of the headers)
        });
        that.processNewTable(arrayOfArrays);
      }

      // let's turn off inDemoMode--because remember this is the bad version where we only allow one demo click
      inDemoMode = false;
    }

    // we have to be bound first (be the first handler to run)
    // because we'll need to prevent all normal handlers from running so we don't get taken away from the page
    $("*").bind("click", demoClick);
  }

  processNewUploadedTableEvent(event){
    var fileName = event.target.files[0].name;
    var fileReader = new FileReader();
    var that = this;
    fileReader.onload = function (event) {

      var str = event.target.result;
      if (!str.endsWith("\n")){
        // sometimes the last row gets dropped because no newline at the end of it
        str = str + "\n";
      }
      // we have the file contents.  let's figure out our new table
      var csvData = $.csv.toArrays(str);

      that.processNewTable(csvData);
    }
    // now that we know how to handle reading data, let's actually read some
    fileReader.readAsText(event.target.files[0]);
  }

  processNewTable(table) {
    //console.log(table);
    this.props.onTableUpload(table)
  }
}
