import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

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
    console.log('ass');
  }

  getUserInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/preferences');
      console.log('retrieved user preferences');

      if (res.status === 200) {
        this.setState({
          gender: res.data.gender,
          sexuality: res.data.sexuality
        });
      }
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    return (
      <div>
        <h1>UserProfile Component</h1>
        <span>Username: {this.state.username}</span>
        <br />
        <span>First Name: {this.state.firstName}</span>
        <br />
        <span>Last Name: {this.state.lastName}</span>
        <br />
        <span>Email: {this.state.email}</span>
        <br />
        <span>Gender: {this.state.gender}</span>
        <br />
        <span>Sexuality: {this.state.sexuality}</span>
      </div>
    );
  }
}

export default hot(module)(UserProfile);