import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import './App.css';
import AuthRoute from './AuthRoute';
import Home from './home';
import Login from './login';
import Registration from './registration';
import UserProfile from './userProfile';
import EditProfile from './editProfile';
import Header from './header';

class App extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/registration' component={Registration} />
          <AuthRoute exact path='/profile' component={UserProfile} />
          <AuthRoute exact path='/profile/edit' component={EditProfile} />
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);