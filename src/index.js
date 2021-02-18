import React from "react";
import ReactDOM from "react-dom";
import Injestor from "./components/Injestor.js";

const INPUT = [
  ["name", "height", "country", "first ascent"],
  ["everest", "29029", "Nepal", "1953"],
  ["denal", "20310", "United States", "1906"],
  ["Kilim", "19341", "Tanzania", "1889"],
  ["K2", "28251", "Pakistan", "1954"],
  ["Aconcagua", "22838", "Argentina", "1897"]
];

const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);
ReactDOM.render(
  <React.StrictMode>
    <Injestor rawTableData={INPUT}/>
  </React.StrictMode>,
  app
);
