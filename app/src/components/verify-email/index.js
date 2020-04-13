import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import {
  Card,
  Alert
} from 'react-bootstrap';

const UPSTREAM_URI = `http://localhost:3001`;

class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      badRequestError: '',
      pendingResponse: true
    }
  }

  componentDidMount() {
    this.onVerifyEmail();
  }

  onVerifyEmail = async () => {
    const { match: { params } } = this.props;

    try {
      await axios.post(
        `${UPSTREAM_URI}/verify-email`,
        {
          token: params.token
        }
      );

      this.props.history.push('/login');
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({ badRequestError: e.response.data });
      } else {
        console.log(e.message || e);
      }
    } finally {
      this.setState({ pendingResponse: false });
    }
  }

  render() {
    const {
      badRequestError,
      pendingResponse
    } = this.state;

    return (
      <React.Fragment>
        <Card>
          <Card.Body>
            {
              pendingResponse
                ? (
                  <Alert variant='primary'>
                    Please wait while we verify your account
                  </Alert>
                ) : (
                  badRequestError && (
                    <Alert variant='danger'>{badRequestError}</Alert>
                  )
                )
            }
          </Card.Body>
        </Card>
      </React.Fragment >
    );
  }
}

export default withRouter(VerifyEmail);