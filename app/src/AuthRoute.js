import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const AuthRoute = ({ component: Component, ...rest }) => {
  try {
    const res = axios.get('http://localhost:3001/user');

    <Route {...rest} render={(props) => (
      res.status === 200
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  } catch (e) { console.log(e.message || e) }
}

// class AuthRoute extends React.Component {

//   constructor(props) {
//     super(props);

//     this.state = { isAuthenticated: false };
//   }

//   componentWillMount = async () => {
//     try {
//       const res = await axios.get('http://localhost:3001/user');

//       this.setState({ isAuthenticated: res.status === 200 });
//     } catch (e) { console.log(e.message || e); }
//   }

//   render() {
//     <Route {...rest} render={(props) => (
//       this.state.isAuthenticated
//         ? <Component {...props} />
//         : <Redirect to='/login' />
//     )} />
//   }
// }

export default hot(module)(AuthRoute);