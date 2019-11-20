import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, isAuthenticated: isAuthenticated, ...rest }) => {
  console.log('AuthRoute', isAuthenticated);
  return (
    <Route {...rest} render={(props) => (
      isAuthenticated
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  );
};

export default hot(module)(AuthRoute);