import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import './App.css';
import Home from './home';
import Login from './login';
import Registration from './registration';
import UserProfile from './userProfile';

class App extends React.Component {

  loggedIn() {
    return false;
  }

  requireAuth(nextState, replace) {
    if (!loggedIn()) {
      replace({
        pathname: '/login'
      });
    }
  }

  render() {
    return (
      <div>
        {/* header */}
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/registration' component={Registration} />
          <Route exact path='/profile' component={UserProfile} />
          {/*
          logout
          browse
          */}
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);