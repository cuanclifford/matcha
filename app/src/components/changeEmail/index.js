import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Validation } from '../../validation/validation';
import Title from '../generic/title';

import {
  Card,
  Button,
  Form,
  Alert
} from 'react-bootstrap';

const UPSTREAM_URI = `${process.env.REACT_APP_UPSTREAM_URI}`;

class ChangeEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isValidEmail: false,
      hasSubmitted: false,
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

    if (!this.state.isValidEmail) {
      return;
    }

    try {
      const res = await axios.put(
        `${UPSTREAM_URI}/email`,
        { email: this.state.email }
      );

      if (res.status === 200) {
        this.props.onSetEmail(this.state.email);
        this.props.history.push('/profile');
      }
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({ badRequestError: e.response.data });
      } else {
        console.log(e.message || e);
      }
    }
  }

  onChangeEmail = (event) => {
    const email = event.target.value;

    this.setState({
      email: email,
      isValidEmail: Validation.isValidEmail(email)
    });
  }

  render() {
    const {
      email,
      isValidEmail,
      hasSubmitted,
      badRequestError
    } = this.state;

    return (
      <div>
        <Title title='Change Email' />
        <Card>
          <Card.Body>
            {
              !!badRequestError && (
                <Alert variant='danger'>{badRequestError}</Alert>
              )
            }
            <Form noValidate onSubmit={this.onSubmit}>
              <Form.Group>
                <Form.Label>New Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter new email address'
                  isInvalid={hasSubmitted && !isValidEmail}
                  value={email}
                  onChange={this.onChangeEmail}
                />
                <Form.Control.Feedback type='invalid'>
                  Not a valid email address
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

export default withRouter(ChangeEmail);