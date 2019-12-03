import React from 'react';
import { withRouter, Link } from 'react-router-dom';
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
    )
    .then((res) => {
      if (res.status === 201)
        this.props.history.push('/login');
    })
    .catch((e) => { console.log(e.message || e); });
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

        <Link to='/'>
          <button>Go Back</button>
        </Link>
      </div>
    );
  }
}

export default withRouter(Registration);