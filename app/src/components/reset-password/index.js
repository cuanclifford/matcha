import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Validation } from '../../validation/validation';
import Title from '../generic/title';

import {
  Card,
  Button,
  Form,
  Alert
} from 'react-bootstrap';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newPassword: '',
      confirmPassword: '',
      isValidNewPassword: false,
      isValidConfirmPassword: false,
      hasSubmitted: '',
      badRequestError: ''
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      hasSubmitted: true,
      badRequestError: ''
    });

    const { match: { params } } = this.props;

    try {
      await axios.post(
        'http://localhost:3001/reset-password',
        {
          token: params.token,
          newPassword: this.state.newPassword,
          confirmPassword: this.state.confirmPassword
        }
      );

      this.props.history.push('/login');
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({ badRequestError: e.response.data });
      } else {
        console.log(e.message || e);
      }
    }
  }

  onChangeNewPassword = (event) => {
    this.setState({
      newPassword: event.target.value,
      isValidNewPassword: Validation.isValidPassword(event.target.value)
    });
  }

  onChangeConfirmPassword = (event) => {
    this.setState({
      confirmPassword: event.target.value,
      isValidConfirmPassword: event.target.value === this.state.newPassword
    });
  }

  render() {
    const {
      newPassword,
      confirmPassword,
      isValidNewPassword,
      isValidConfirmPassword,
      hasSubmitted,
      badRequestError
    } = this.state;

    return (
      <React.Fragment>
        <Title title='Reset Password' />
        <Card>
          <Card.Body>
            {
              !!badRequestError && (
                <Alert variant='danger'>{badRequestError}</Alert>
              )
            }
            <Form noValidate onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter new password'
                  isInvalid={hasSubmitted && !isValidNewPassword}
                  value={newPassword}
                  onChange={this.onChangeNewPassword}
                />
                <Form.Control.Feedback type='invalid'>
                  Cannot be your old password. Must be at least 8 characters and should contain at least one lower-case letter, one upper-case letter, and one number
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm new password'
                  isInvalid={hasSubmitted && !isValidConfirmPassword}
                  value={confirmPassword}
                  onChange={this.onChangeConfirmPassword}
                />
                <Form.Control.Feedback type='invalid'>
                  Passwords do not match
                </Form.Control.Feedback>
              </Form.Group>
              <Button type='submit'>Submit</Button>
            </Form>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default withRouter(ResetPassword);