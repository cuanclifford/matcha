import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, isAuthenticated: isAuthenticated, verified: verified, ...rest }) => {
  return (
    <Route {...rest} render={(props) => (
      isAuthenticated
        ? verified
          ? <Component {...props} />
          : <Redirect to='/verify-account' />
        : <Redirect to='/login' />
    )} />
  );
};

export default AuthRoute;