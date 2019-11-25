import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import axios from 'axios';

import './App.css';
import Home from './home';
import Login from './login';
import Registration from './registration';
import UserProfile from './userProfile';
import EditProfile from './editProfile';
import Browse from './browse';
import Header from './header';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isAuthenticated: false,
      username: '',
      firstName: '',
      lastName: '',
      email: '',
    }
  }

  componentDidMount() {
    this.onUserLogin();
  }

  onUserLogin = async () => {
    this.setState({ loading: true });
    try {
      const res = await axios.get('http://localhost:3001/user');

      this.setState({ isAuthenticated: true });
      if (res.status === 200) {
        this.setState({
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
        });
      } else {
        this.setState({ isAuthenticated: false });
      }
    } catch (e) {
      this.setState({ isAuthenticated: false });
      console.log(e.message || e);
    } finally {
      this.setState({ loading: false });
    }
  }

  onUserLogout = async () => {
    try {
      this.setState({ loading: true });
      await axios.get('http://localhost:3001/logout');
      this.setState({
        loading: false,
        isAuthenticated: false,
      });
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    const {
      loading,
      isAuthenticated,
      username,
      firstName,
      lastName,
      email,
    } = this.state;

    return (
      loading
      ? <span>Loading...</span>
      :
      <div>
        <Header
          isAuthenticated={isAuthenticated}
          onUserLogout={this.onUserLogout}
          username={username}
          firstName={firstName}
          lastName={lastName}
        />
        <hr />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={
            () => <Login
                    onUserLogin={this.onUserLogin}
                    onUserLogout={this.onUserLogout}
                  />
          } />
          <Route exact path='/registration' component={Registration} />
          <Route exact path='/profile' component={
            () => <UserProfile
                    isAuthenticated={isAuthenticated}
                    username={username}
                    firstName={firstName}
                    lastName={lastName}
                    email={email}
                  />
          } />
          <Route exact path='/browse' component={
            () => <Browse isAuthenticated={isAuthenticated} />
          } />
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);