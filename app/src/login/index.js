import React from 'react';
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

  onLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3001/login',
        {
          username: this.state.username,
          password: this.state.password
        }
      );

      // if (res.status === 200) {
      //   this.props.history.push('/profile');
      // }
    } catch (e) { console.log(e.message || e); }
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