import React from 'react';
import ReactDOM from 'react-dom';
import {Application} from './app/Application';
import "./components/baseStyle.css"
import "./components/commonstyle.css"
import "./components/constants.css"
import "./components/themes.css"
// import {initBackground} from "../background/backgroundConfig";

console.log("log filepath:", require('electron-log').transports.file.file)

// if (window.location.search === "?worker=true") {
// 	initBackground();
// } else {
	ReactDOM.render(<Application/>, document.getElementById('app'));
// }

