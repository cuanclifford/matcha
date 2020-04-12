import React from 'react';
import { withRouter } from 'react-router-dom';

import './title.css';

import {
  Button
} from 'react-bootstrap';

class Title extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className='flex-spaced-start title-container'>
          <Button
            size='sm'
            onClick={() => this.props.history.goBack()}
          >
            Back
          </Button>
          <h2 className='ml-2'>{this.props.title}</h2>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Title);