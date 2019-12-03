import React from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import './App.css';
import AuthRoute from './AuthRoute';
import Home from './home';
import Login from './login';
import Registration from './registration';
import UserProfile from './userProfile';
import EditProfile from './editProfile';
import Browse from './browse';
import BrowseProfile from './browseProfile';
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
      gender_id: NaN,
      sexuality_id: NaN,
      gender: '',
      sexuality: '',
      biography: '',
      birthdate: '',
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
        this.onSetUserInfo(res.data);
        await this.onGetUserProfileInfo();
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

  onSetUserInfo = (userInfo) => {
    this.setState({
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
    });
  }

  onSetProfileInfo = (profileInfo) => {
    console.log(profileInfo);
    this.setState({
      gender_id: profileInfo.gender_id,
      sexuality_id: profileInfo.sexuality_id,
      gender: profileInfo.gender,
      sexuality: profileInfo.sexuality,
      biography: profileInfo.biography,
      birthdate: profileInfo.birthdate,
    });
  }

  onGetUserProfileInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/profile');

      if (res.status === 200) {
        this.onSetProfileInfo(res.data);
      }
    } catch (e) { console.log(e.message || e); }
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
      gender_id,
      sexuality_id,
      gender,
      sexuality,
      biography,
      birthdate,
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
          <AuthRoute exact path='/profile' isAuthenticated={isAuthenticated}
            component={
              () => <UserProfile
                      username={username}
                      firstName={firstName}
                      lastName={lastName}
                      email={email}
                      gender={gender}
                      sexuality={sexuality}
                      biography={biography}
                      birthdate={birthdate}
                    />
            }
          />
          <AuthRoute exact path='/edit-profile' isAuthenticated={isAuthenticated}
            component={
              () => <EditProfile
                      username={username}
                      firstName={firstName}
                      lastName={lastName}
                      email={email}
                      gender_id={gender_id}
                      sexuality_id={sexuality_id}
                      biography={biography}
                      birthdate={birthdate}
                      onSetUserInfo={this.onSetUserInfo}
                      onSetProfileInfo={this.onSetProfileInfo}
                    />
            }
          />
          <AuthRoute exact path='/browse' isAuthenticated={isAuthenticated} component={Browse} />
          <AuthRoute exact path='/profile/:userId' isAuthenticated={isAuthenticated} component={BrowseProfile} />
        </Switch>
      </div>
    );
  }
}

export default App;