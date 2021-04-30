import React from 'react';
import ReactDOM from 'react-dom';
import Injestor from "./injestor/components/Injestor.js";
import registerServiceWorker from './registerServiceWorker';

const INPUT = [
  ["name", "height", "country", "first ascent"],
  ["everest", "29029", "Nepal", "1953"],
  ["denal", "20310", "United States", "1906"],
  ["Kilim", "19341", "Tanzania", "1889"],
  ["K2", "28251", "Pakistan", "1954"],
  ["Aconcagua", "22838", "Argentina", "1897"]
];

ReactDOM.render(<Injestor rawTableData={INPUT}/>, document.getElementById('root'));
registerServiceWorker();
