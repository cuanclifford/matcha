import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      sexuality: '',
      interests: []
    };
  }

  componentDidMount() {
    const userData = JSON.parse(sessionStorage.getItem('user-data'));
    this.setState({
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      gender: userData.gender,
      sexuality: userData.sexuality,
      interests: userData.interests
    });
    console.log(userData);
  }

  render() {
    return (
      <div>
        <h1>UserProfile Component</h1>
        <p>Username: {this.state.username}</p>
        <p>First Name: {this.state.firstName}</p>
        <p>Last Name: {this.state.lastName}</p>
        <p>Email: {this.state.email}</p>
        <p>Gender: {this.state.gender}</p>
        <p>Sexuality: {this.state.sexuality}</p>
        <p>Interests:</p>
        <ul>
          {
            this.state.interests && this.state.interests.map((value, index) => (
              <li>{value}</li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default hot(module)(UserProfile);