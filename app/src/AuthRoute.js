import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Redirect } from 'react-router-dom';

const auth = {
  isAuthenticated: false,
  authenticate() {
    auth.isAuthenticated = true;
  },
  deauthenticate() {
    auth.isAuthenticated = false;
  }
}

const AuthRoute = ({ component: Component, isAuthenticated: isAuthenticated, ...rest }) => {
  return (
    <Route {...rest} render={(props) => (
      auth.isAuthenticated
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );
};

export default hot(module)(AuthRoute);