import React from "react";
import ReactDOM from "react-dom";
import Injestor from "./components/Injestor.js";

const INPUT = [
  ["name", "age", "country"],
  ["nakita", "34", "USA"],
  ["beatrice", "27", "Sweden"],
  ["Phoebe", "1", "Peru"]
];

ReactDOM.render(
  <React.StrictMode>
    <Injestor rawTableData={INPUT}/>
  </React.StrictMode>,
  document.getElementById('injestor')
);
