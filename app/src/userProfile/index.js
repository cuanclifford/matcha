import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class UserProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      sexuality: '',
    }
  }

  componentDidMount() {
    this.setState({
      isAuthenticated: this.props.isAuthenticated,
      username: this.props.username,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
    });

    this.getUserInfo();
  }

  getUserInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/preferences');

      if (res.status === 200) {
        this.setState({
          gender: res.data.gender,
          sexuality: res.data.sexuality
        });
      }
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    const {
      username,
      isAuthenticated,
      firstName,
      lastName,
      email,
      gender,
      sexuality,
    } = this.state;

    return (
      <div>
        <h1>UserProfile Component</h1>
        <span>Username: {username}</span>
        <br />
        <span>First Name: {firstName}</span>
        <br />
        <span>Last Name: {lastName}</span>
        <br />
        <span>Email: {email}</span>
        <br />
        <span>Gender: {gender}</span>
        <br />
        <span>Sexuality: {sexuality}</span>
      </div>
    );
  }
}

export default hot(module)(UserProfile);