import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class Registration extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    }
  }

  onRegister = () => {
    axios.post(
      'http://localhost:3001/registration',
      {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      }
    ).then((res) => {
      this.props.history.push('/');
    });
  }

  render() {
    return (
      <div>
        <h1>Registration Component</h1>
        <label>First name:
            <input
            type='text'
            placeholder='First name'
            value={this.state.firstName}
            onChange={
              (event) => {
                this.setState({ firstName: event.target.value });
              }
            }
          />
        </label>

        <label>Last name:
            <input
            type='text'
            placeholder='Last name'
            value={this.state.lastName}
            onChange={
              (event) => {
                this.setState({ lastName: event.target.value });
              }
            }
          />
        </label>

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

        <label>Email:
            <input
            type='email'
            placeholder='Email'
            value={this.state.email}
            onChange={
              (event) => {
                this.setState({ email: event.target.value });
              }
            }
          />
        </label>

        <label>Password:
            <input
            type='password'
            placeholder='Password'
            value={this.state.value}
            onChange={
              (event) => {
                this.setState({ password: event.target.value });
              }
            }
          />
        </label>

        <button onClick={this.onRegister}>Register</button>
        <button onClick={() => { this.props.history.push('/'); }}>
          Go Back
        </button>
      </div>
    );
  }
}

export default hot(module)(Registration);