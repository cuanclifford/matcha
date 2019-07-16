import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  onLogin = () => {
    axios.post(
      'http://localhost:3001/login',
      this.state.username,
      this.state.password
    ).then((res) => {
      if (res.data.success)
        this.props.history.push('/profile');
    });
  }

  render() {
    return (
      <div>
        <h1>Login Component</h1>
        <label>Username:
          <input
            type='text'
            placeholder='Username'
            value={this.state.username}
            onChange={
              (event) => {
                this.setState({ username: event.target.value });
              }
            }
          />
        </label>

        <label>Password:
          <input
            type='password'
            placeholder='Password'
            value={this.state.password}
            onChange={
              (event) => {
                this.setState({ password: event.target.value });
              }
            }
          />
        </label>

        <button onClick={this.onLogin}>Log In</button>

        <button onClick={() => { this.props.history.push('/'); }}>
          Go Back
        </button>
      </div>
    );
  }
}

export default hot(module)(Login);