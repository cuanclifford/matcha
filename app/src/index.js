import React from 'react';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import history from './history';
import App from './App.js';

require('@babel/polyfill');

ReactDOM.render((
  <Router history={history}>
    <App />
  </Router>
), document.getElementById('root')
);