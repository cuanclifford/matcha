import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';

import {
  Card,
  Button,
  Form
} from 'react-bootstrap';

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
    const {
      firstName,
      lastName,
      username,
      email,
      password
    } = this.state;

    return (
      <div>
        <Title title='Register' />

        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter first name'
                  value={firstName}
                  onChange={
                    (event) => {
                      this.setState({ firstName: event.target.value });
                    }
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter last name'
                  value={lastName}
                  onChange={
                    (event) => {
                      this.setState({ lastName: event.target.value });
                    }
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Username</Form.Label>
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
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={
                    (event) => {
                      this.setState({ email: event.target.value });
                    }
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
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
              <Button variant='success' onClick={this.onRegister}>Register</Button>
            </div>
          </Card.Body>
        </Card>

      </div>
    );
  }
}

export default withRouter(Registration);