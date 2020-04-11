import React from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import './App.css';
import AuthRoute from './AuthRoute';
import Home from './components/home';
import Login from './components/login';
import Registration from './components/registration';
import UserProfile from './components/userProfile';
import EditProfile from './components/editProfile';
import ChangeEmail from './components/changeEmail';
import ChangePassword from './components/changePassword';
import EditInterests from './components/editInterests';
import EditImages from './components/editImages';
import Browse from './components/browse';
import BrowseProfile from './components/browseProfile';
import Matches from './components/matches';
import Chat from './components/chat';
import Header from './components/header';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      isAuthenticated: false,
      userId: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      genderId: NaN,
      sexualityId: NaN,
      gender: '',
      sexuality: '',
      biography: '',
      birthdate: ''
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
        this.setState({ userId: res.data.userId });

        this.onSetUserInfo(res.data);

        await this.onGetEmail();
        await this.onGetProfileInfo();
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

  onGetProfileInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/profile');

      if (res.status === 200) {
        this.onSetProfileInfo(res.data);
      }
    } catch (e) { console.log(e.message || e); }
  }

  onGetEmail = async () => {
    try {
      const res = await axios.get('http://localhost:3001/email');

      if (res.status === 200) {
        this.onSetEmail(res.data.email);
      }
    } catch (e) { console.log(e.message || e); }
  }

  onSetUserInfo = (userInfo) => {
    this.setState({
      username: userInfo.username,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName
    });
  }

  onSetEmail = (email) => {
    this.setState({ email: email });
  }

  onSetProfileInfo = (profileInfo) => {
    this.setState({
      genderId: profileInfo.gender_id,
      sexualityId: profileInfo.sexuality_id,
      gender: profileInfo.gender,
      sexuality: profileInfo.sexuality,
      biography: profileInfo.biography,
      birthdate: profileInfo.birthdate
    });
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
      userId,
      username,
      firstName,
      lastName,
      email,
      genderId,
      sexualityId,
      gender,
      sexuality,
      biography,
      birthdate
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
        <div className='app-container p-3'>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={
              () => <Login
                onUserLogin={this.onUserLogin}
                onUserLogout={this.onUserLogout}
              />
            } />
            <Route exact path='/register' component={Registration} />
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
                  genderId={genderId}
                  sexualityId={sexualityId}
                  biography={biography}
                  birthdate={birthdate}
                  onSetUserInfo={this.onSetUserInfo}
                  onSetProfileInfo={this.onSetProfileInfo}
                />
              }
            />
            <AuthRoute exact path='/change-email' isAuthenticated={isAuthenticated}
              component={
                () => <ChangeEmail
                  email={email}
                  onSetEmail={this.onSetEmail}
                />
              }
            />
            <AuthRoute exact path='/change-password' isAuthenticated={isAuthenticated} component={ChangePassword} />
            <AuthRoute exact path='/edit-interests' isAuthenticated={isAuthenticated} component={EditInterests} />
            <AuthRoute exact path='/edit-images' isAuthenticated={isAuthenticated} component={EditImages} />
            <AuthRoute exact path='/browse' isAuthenticated={isAuthenticated} component={Browse} />
            <AuthRoute exact path='/profile/:userId' isAuthenticated={isAuthenticated} component={BrowseProfile} />
            <AuthRoute exact path='/matches' isAuthenticated={isAuthenticated} component={Matches} />
            <AuthRoute exact path='/chat/:matchId' isAuthenticated={isAuthenticated}
              component={
                (props) => <Chat
                  {...props}
                  userId={userId}
                />
              }
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;