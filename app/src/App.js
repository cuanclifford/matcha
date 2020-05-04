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
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/reset-password';
import VerifyAccount from './components/verify-account';
import VerifyEmail from './components/verify-email';

const UPSTREAM_URI = `http://localhost:3001`;

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
      birthdate: '',
      verified: false,
      latitude: '',
      longitude: '',
    }
  }

  componentDidMount() {
    this.onUserLogin();
  }

  onGetIp = async () => {
    try {
      const check = await axios.get(`${UPSTREAM_URI}/locationcheck`,
        {
          user_id: this.state.userId
        });
      
      // console.log(check.status);
    } catch (e) {
      // console.log('Location is null');
      // console.log('Location check failed => This should call set locations');
    try {
      const ipRes = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=69c997614e88492d88f9e4013f817eab');
      if (ipRes.status == 200) {
        this.setState({
          latitude: ipRes.data.latitude,
          longitude: ipRes.data.longitude});

        console.log(ipRes.data);
      }
    } catch {
      alert('IP Failed');
    } finally {
      try {
      //Databse push
        await axios.post(`${UPSTREAM_URI}/location`,
        {
          latitude: this.state.latitude,
          longitude: this.state.longitude
        });
        } catch (e) {
          console.log(e);
          console.log('Post to database failed');
        }
      if (this.state.longitude && this.state.latitude) {
        console.log("Done. Now its time for the database");
      }
    }
  }
  }

  onUserLogin = async () => {
    this.setState({ loading: true });
    try {
      const res = await axios.get(`${UPSTREAM_URI}/user`);
      this.setState({ isAuthenticated: true });

      if (res.status === 200) {
        this.setState({ userId: res.data.userId });

        this.onSetUserInfo(res.data);

        await this.onGetEmail();
        await this.onGetProfileInfo();
        await this.onGetVerificationStatus();
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

  onGetVerificationStatus = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/verified`);

      if (res.status === 200) {
        this.setState({ verified: res.data.verified });
      }
    } catch (e) { console.log(e.message || e) }
  }

  onGetProfileInfo = async () => {
      this.onGetIp();

    // try {
    //   const res = await this.onGetIp();
    //   if (res == 200) {
    //     try {
    //     await axios.post(`${UPSTREAM_URI}/location`, 
    //     {
    //       userId: this.state.userId,
    //       latitude: this.state.latitude,
    //       longitude: this.state.longitude
    //     });
    //     } catch {
    //     console.log('Post to database failed');
    //    }
    //   }
      
    // } catch {
    //   console.log('Location service broken')
    // }

    try {
      const res = await axios.get(`${UPSTREAM_URI}/profile`);

      if (res.status === 200) {
        this.onSetProfileInfo(res.data);
      }
    } catch (e) { console.log(e.message || e); }
  }

  onGetEmail = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/email`);

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
      await axios.get(`${UPSTREAM_URI}/logout`);
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
      birthdate,
      verified,
      latitude,
      longitude
    } = this.state;

    return (
      loading
        ? <span>Loading...</span>
        :
        <div>
          <Header
            isAuthenticated={isAuthenticated} verified={verified}
            onUserLogout={this.onUserLogout}
            userId={userId}
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
              <Route exact path='/forgot-password' component={ForgotPassword} />
              <Route exact path='/reset-password/:token' component={ResetPassword} />
              <Route exact path='/verify-account' component={VerifyAccount} />
              <Route exact path='/verify-email/:token' component={VerifyEmail} />
              <AuthRoute exact path='/profile' isAuthenticated={isAuthenticated} verified={verified}
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
                    // latitude={latitude}
                    // longitude={longitude}
                  />
                }
              />
              <AuthRoute exact path='/edit-profile' isAuthenticated={isAuthenticated} verified={verified}
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
              <AuthRoute exact path='/change-email' isAuthenticated={isAuthenticated} verified={verified}
                component={
                  () => <ChangeEmail
                    onSetEmail={this.onSetEmail}
                  />
                }
              />
              <AuthRoute exact path='/change-password' isAuthenticated={isAuthenticated} component={ChangePassword} verified={verified} />
              <AuthRoute exact path='/edit-interests' isAuthenticated={isAuthenticated} component={EditInterests} verified={verified} />
              <AuthRoute exact path='/edit-images' isAuthenticated={isAuthenticated} component={EditImages} verified={verified} />
              <AuthRoute exact path='/browse' isAuthenticated={isAuthenticated} component={Browse} verified={verified} />
              <AuthRoute exact path='/profile/:userId' isAuthenticated={isAuthenticated} component={BrowseProfile} verified={verified} />
              <AuthRoute exact path='/matches' isAuthenticated={isAuthenticated} component={Matches} verified={verified} />
              <AuthRoute exact path='/chat/:matchId' isAuthenticated={isAuthenticated} verified={verified}
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