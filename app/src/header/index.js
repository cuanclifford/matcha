import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';

class Header extends React.Component {

  isLoggedIn = () => (
    this.props.isAuthenticated
      ? (
        <div>
          <span>Welcome, {this.props.firstName} {this.props.lastName}!</span>
          <br />
          <Link to='/login'>
            <button onClick={this.props.onUserLogout} >Log Out</button>
          </Link>

          <Link to='/profile'>
            <button>Profile</button>
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