import React from 'react';
import { Link } from 'react-router-dom';
import Title from '../generic/title';

import {
  Card,
  Button
} from 'react-bootstrap';

class VerifyAccount extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Title title='Verify Account' />
        <Card>
          <Card.Body>
            <Card.Title>Please check your inbox for a verification link</Card.Title>
            <Link to='/login'>
              <Button variant='success'>Log In</Button>
            </Link>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }
}

export default VerifyAccount;