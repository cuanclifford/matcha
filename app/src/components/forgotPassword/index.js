import React from 'react';
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

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isValidEmail: false,
      hasSubmitted: false,
      badResponseError: ''
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      hasSubmitted: true,
      badResponseError: ''
    });

    if (!this.state.isValidEmail) {
      return;
    }

    try {
      await axios.post(
        `${UPSTREAM_URI}/forgot-password`,
        {
          email: this.state.email
        }
      );
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({ badResponseError: e.response.data });
      } else {
        console.log(e.message || e);
      }
    }
  }

  onChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
      isValidEmail: Validation.isValidEmail(event.target.value)
    });
  }

  render() {
    const {
      email,
      isValidEmail,
      hasSubmitted,
      badResponseError
    } = this.state;

    return (
      <React.Fragment>
        <Title title='Forgot Password' />

        <Card>
          <Card.Body>
            {
              !!badResponseError && (
                <Alert variant='danger'>{badResponseError}</Alert>
              )
            }
            <Form noValidate onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>Enter email</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter email address'
                  isInvalid={hasSubmitted && !isValidEmail}
                  value={email}
                  onChange={this.onChangeEmail}
                />
              </Form.Group>
              <div className='flex-spaced-around'>
                <Button
                  variant='success'
                  type='submit'
                >
                  Send Link
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default ForgotPassword;