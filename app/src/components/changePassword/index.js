import React from 'react';
import axios from 'axios';

import {
  Card,
  Form,
  Button,
  Alert
} from 'react-bootstrap';

const UPSTREAM_URI = `${process.env.UPSTREAM_URI}`;

class ChangePassword extends React.Component {
  re = new RegExp(/(?=.*[a-z]+.*$)(?=.*[A-Z]+.*$)(?=.*[0-9]+.*$).{8,100}$/);

  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      hasSubmitted: false,
      isValidNewPassword: false,
      isValidConfirmPassword: false,
      badRequestError: '',
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      hasSubmitted: true,
      badRequestError: ''
    });

    if (
      !!this.state.oldPassword
      && this.state.isValidNewPassword
      && this.state.isValidConfirmPassword
    ) {
      try {
        const res = await axios.put(
          `${UPSTREAM_URI}/user/password`,
          {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            confirmPassword: this.state.confirmPassword
          }
        );

      } catch (e) {
        if (e.response.status === 400) {
          this.setState({ badRequestError: e.response.data });
        } else {
          console.log(e.message || e);
        }
      }
    }
  }

  validateNewPassword = (newPassword) => {
    this.setState({
      isValidNewPassword: this.re.test(newPassword)
    });
  }

  validateConfirmPassword = (confirmPassword) => {
    const newPassword = this.state.newPassword;

    this.setState({
      isValidConfirmPassword: this.re.test(confirmPassword)
        && confirmPassword === newPassword
    });
  }

  onChangeNewPassword = (event) => {
    this.setState({ newPassword: event.target.value });

    this.validateNewPassword(event.target.value);
  }

  onChangeConfirmPassword = (event) => {
    this.setState({ confirmPassword: event.target.value });

    this.validateConfirmPassword(event.target.value);
  }

  render() {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      hasSubmitted,
      isValidNewPassword,
      isValidConfirmPassword,
      badRequestError
    } = this.state;

    return (
      <div>
        <h1>Change Password</h1>

        <Card>
          <Card.Body>
            {
              !!badRequestError && (
                <Alert variant='danger'>The data you entered was invalid, please try again</Alert>
              )
            }
            <Form noValidate onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  required
                  type='password'
                  placeholder='Enter old password'
                  value={oldPassword}
                  isInvalid={hasSubmitted && !oldPassword}
                  onChange={
                    (event) => {
                      this.setState({ oldPassword: event.target.value });
                    }
                  }
                />
                <Form.Control.Feedback type='invalid'>
                  Required
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  required
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
                  required
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
      </div>
    );
  }
}

export default ChangePassword;