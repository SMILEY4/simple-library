import React from "react";
import ReactDOM from "react-dom";
import {Application} from "./app/Application";
import "./components/baseStyle.css";
import "./components/commonstyle.css";
import "./components/constants.css";
import "./components/themes.css";
import {initWorker} from "../worker/setup";

const log = require("electron-log");
Object.assign(console, log.functions);
console.log("log filepath (renderer):", log.transports.file.getFile().path);

const isWorker: boolean = window.process.argv.some(a => a === "--worker");

if (isWorker) {
	initWorker();
} else {
	ReactDOM.render(<Application/>, document.getElementById("app"));
}
