import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    !!localStorage.getItem('jwtAuth')
      ? <Component {...props } />
      : <Redirect to='/login' />
  )} />
)

export default hot(module)(AuthRoute);