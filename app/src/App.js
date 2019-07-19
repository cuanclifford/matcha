import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import './App.css';
import AuthRoute from './AuthRoute';
import Home from './home';
import Login from './login';
import Registration from './registration';
import UserProfile from './userProfile';

class App extends React.Component {

  render() {
    return (
      <div>
        {/* header */}
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/registration' component={Registration} />
          <AuthRoute exact path='/profile' component={UserProfile} />
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);