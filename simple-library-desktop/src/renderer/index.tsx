import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './app/Application';
// import './components/style/commonstyle.css';
// import './components/style/basestyle.css';
// import './components/style/constants_theme.css';
// import './components/style/constants_all.css';
// import './components/style/customContextify.css';
// import "react-contexify/dist/ReactContexify.css";

import "./components/baseStyle.css"
import "./components/commonstyle.css"
import "./components/constants.css"
import "./components/themes.css"

ReactDOM.render(<Application />, document.getElementById('app'));
