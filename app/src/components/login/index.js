import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

import {
  Card,
  Button,
  Form
} from 'react-bootstrap';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    }
  }

  onLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3001/login',
        {
          username: this.state.username,
          password: this.state.password,
        }
      );

      if (res.status === 200) {
        this.props.onUserLogin();
        this.props.history.push('/profile');
      }
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    const {
      username,
      password
    } = this.state;

    return (
      <div>
        <h2>Login</h2>

        <Card>
          <Card.Body>

            <Form>
              <Form.Group>
                <Form.Label>
                  Username
                </Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter username'
                  value={username}
                  onChange={
                    (event) => {
                      this.setState({ username: event.target.value });
                    }
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Password
                </Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={
                    (event) => {
                      this.setState({ password: event.target.value });
                    }
                  }
                />
              </Form.Group>
            </Form>
            
            <div className='flex-spaced-around'>
              <Button variant='success' onClick={this.onLogin}>Log In</Button>

              <Link to='/'>
                <Button>Back</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
        <div className='flex-spaced-evenly'>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);