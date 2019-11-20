import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class Header extends React.Component {

  isLoggedIn = () => (
    this.props.isAuthenticated
      ? (
        <div>
          <span>Welcome, {this.props.firstName} {this.props.lastName}!</span>
          <Link to="/login">
            <button onClick={this.props.onUserLogout} >Log Out</button>
          </Link>
        </div>
      )
      : (
        <span>Not logged in</span>
      )
  )

  render() {
    return (
      <div>
        <h1>HeaderComponent</h1>
        {this.isLoggedIn()}
      </div>
    );
  }
}

export default hot(module)(withRouter(Header));