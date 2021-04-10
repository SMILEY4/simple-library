import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from './app/application';
import './components/style/commonstyle.css';
import './components/style/basestyle.css';
import './components/style/themes.css';
import './components/style/constants.css';
import './components/style/customContextify.css';
import "react-contexify/dist/ReactContexify.css";


ReactDOM.render(<Application />, document.getElementById('app'));
