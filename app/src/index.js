import React from 'react';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import history from './history';
import App from './App.js';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.withCredentials = true;

require('@babel/polyfill');

ReactDOM.render((
  <Router history={history}>
    <App />
  </Router>
), document.getElementById('root')
);