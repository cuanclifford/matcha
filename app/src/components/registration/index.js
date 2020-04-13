import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';
import { Validation } from '../../validation/validation';

import {
  Card,
  Button,
  Form,
  Alert
} from 'react-bootstrap';

const UPSTREAM_URI = `http://localhost:3001`;

class Registration extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      hasSubmitted: false,
      isValidFirstName: false,
      isValidLastName: false,
      isValidUsername: false,
      isValidEmail: false,
      isValidPassword: false,
      badRequestError: ''
    }
  }

  onRegister = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({
      hasSubmitted: true,
      badRequestError: ''
    });

    if (!(
      this.state.isValidFirstName
      && this.state.isValidLastName
      && this.state.isValidUsername
      && this.state.isValidEmail
      && this.state.isValidPassword
    )) {
      return;
    }

    try {
      const res = await axios.post(
        `${UPSTREAM_URI}/registration`,
        {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        }
      );

      if (res.status === 201) {
        this.props.history.push('/verify-account');
      }
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({
          badRequestError: e.response.data
        });
      } else {
        console.log(e.message || e);
      }
    }
  }

  onChangeFirstName = (event) => {
    this.setState({
      firstName: event.target.value,
      isValidFirstName: Validation.isValidFirstName(event.target.value)
    });
  }

  onChangeLastName = (event) => {
    this.setState({
      lastName: event.target.value,
      isValidLastName: Validation.isValidLastName(event.target.value)
    });
  }

  onChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
      isValidUsername: Validation.isValidUsername(event.target.value)
    });
  }

  onChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
      isValidEmail: Validation.isValidEmail(event.target.value)
    });
  }

  onChangePassword = (event) => {
    this.setState({
      password: event.target.value,
      isValidPassword: Validation.isValidPassword(event.target.value)
    });
  }

  onEnter(key) {
    if (key === 13) {
      this.onRegister();
    }
  }

  render() {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      hasSubmitted,
      isValidFirstName,
      isValidLastName,
      isValidUsername,
      isValidEmail,
      isValidPassword,
      badRequestError
    } = this.state;

    return (
      <div>
        <Title title='Register' />

        <Card>
          <Card.Body>
            {
              !!badRequestError && (
                <Alert variant='danger'>{badRequestError}</Alert>
              )
            }
            <Form
              noValidate
              onSubmit={this.onRegister}
              onKeyUp={
                (event) => {
                  this.onEnter(event.keyCode);
                }
              }
            >
              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter first name'
                  isInvalid={hasSubmitted && !isValidFirstName}
                  value={firstName}
                  onChange={this.onChangeFirstName}
                />
                <Form.Control.Feedback type='invalid'>
                  Invalid first name
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter last name'
                  isInvalid={hasSubmitted && !isValidLastName}
                  value={lastName}
                  onChange={this.onChangeLastName}
                />
                <Form.Control.Feedback type='invalid'>
                  Invalid last name
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter username'
                  isInvalid={hasSubmitted && !isValidUsername}
                  value={username}
                  onChange={this.onChangeUsername}
                />
                <Form.Control.Feedback type='invalid'>
                  Invalid username
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  isInvalid={hasSubmitted && !isValidEmail}
                  value={email}
                  onChange={this.onChangeEmail}
                />
                <Form.Control.Feedback type='invalid'>
                  Invalid email
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  isInvalid={hasSubmitted && !isValidPassword}
                  value={password}
                  onChange={this.onChangePassword}
                />
                <Form.Control.Feedback type='invalid'>
                  Password must be at least 8 characters and should contain at least one lower-case letter, one upper-case letter, and one number
                </Form.Control.Feedback>
              </Form.Group>
              <div className='flex-spaced-around'>
                <Button type='submit' variant='success'>Register</Button>
              </div>
            </Form>

          </Card.Body>
        </Card>

      </div>
    );
  }
}

export default withRouter(Registration);