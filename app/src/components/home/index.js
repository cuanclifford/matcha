import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  Jumbotron,
  ButtonGroup,
  Button
} from 'react-bootstrap';

class Home extends React.Component {
  render() {
    return (
      <div>
        <Jumbotron>
          <h1>Welcome to Matcha</h1>
          <p>Sign up for endless amounts of dead conversations and false promises of finding love!</p>
          <ButtonGroup>
            <Button
              variant='outline-success'
              onClick={() => this.props.history.push('/login')}
            >
              Log In
            </Button>
            <Button
              variant='success'
              onClick={() => this.props.history.push('/register')}
            >
              Register
            </Button>
          </ButtonGroup>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;