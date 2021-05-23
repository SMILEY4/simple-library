import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './app/application';
// import './components/style/commonstyle.css';
// import './components/style/basestyle.css';
// import './components/style/constants_theme.css';
// import './components/style/constants_all.css';
// import './components/style/customContextify.css';
// import "react-contexify/dist/ReactContexify.css";

import "./newcomponents/baseStyle.css"
import "./newcomponents/commonstyle.css"
import "./newcomponents/constants.css"
import "./newcomponents/themes.css"

ReactDOM.render(<Application />, document.getElementById('app'));
