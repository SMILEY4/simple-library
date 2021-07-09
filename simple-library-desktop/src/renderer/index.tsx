import React from 'react';
import ReactDOM from 'react-dom';
import {Application} from './app/Application';
import "./components/baseStyle.css"
import "./components/commonstyle.css"
import "./components/constants.css"
import "./components/themes.css"

console.log("log filepath:", require('electron-log').transports.file.file)

window.require('electron').ipcRenderer.invoke(
    "window.register",
    {f: "index.tsx / " + window.location.search, d: JSON.stringify(document.title)}
);

if (window.location.search === "?worker=true") {
    console.log("Im a worker")
} else {
    console.log("Im the renderer")
    ReactDOM.render(<Application/>, document.getElementById('app'));
}

