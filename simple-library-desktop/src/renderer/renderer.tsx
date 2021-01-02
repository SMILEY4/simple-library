
import '_public/style.css';

// @ts-ignore
import forest from "_public/forest.jpg"

import * as React from 'react';
import * as ReactDOM from 'react-dom';

ReactDOM.render(
  <div className="app">
    <h4>Welcome to React, Electron and Typescript</h4>
    <p>Hello</p>
    <img src={forest} alt="No Image :("/>
  </div>,
  document.getElementById('app'),
);
