import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import axios from 'axios';

import './App.css';
import AuthRoute from './AuthRoute';
import Home from './home';
import Login from './login';
import Registration from './registration';
import UserProfile from './userProfile';
import EditProfile from './editProfile';
import Header from './header';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      username: '',
      firstName: '',
      lastName: ''
    }
  }

  componentDidMount() {
    this.onUserAuthenticate();
  }

  onUserAuthenticate = async () => {
    try {
      const user = await axios.get('http://localhost:3001/user');

      if (user.status === 200) {
        this.setState({
          isAuthenticated: true,
          username: user.data.username,
          firstName: user.data.firstName,
          lastName: user.data.lastName
        });

        // if (res.status === 200) {
        //   this.props.history.push('/profile');
        // }
      } else {
        this.setState({
          isAuthenticated: false
        });
      }
    } catch (e) { console.log(' ass ' + e.message || e); }
  }

  onUserLogout = async () => {
    try {
      const res = await axios.get('http://localhost:3001/logout');

      if (res.status === 200) {
        this.setState({
          isAuthenticated: false
        });
      }
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Header
          isAuthenticated={this.state.isAuthenticated}
          username={this.state.username}
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          onUserLogout={this.onUserLogout}
        />
        <hr />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={() => <Login onUserAuthenticate={this.onUserAuthenticate} />} />
          <Route exact path='/registration' component={Registration} />
          <AuthRoute exact path='/profile' component={UserProfile} />
          <AuthRoute exact path='/profile/edit' component={EditProfile} />
        </Switch>
        <hr />
      </div>
    );
  }
}

export default hot(module)(App);