import React from 'react';
import { withRouter, Link } from 'react-router-dom';

class Header extends React.Component {

  isLoggedIn = () => (
    this.props.isAuthenticated
      ? (
        <div>
          <span>Welcome, {this.props.firstName} {this.props.lastName}!</span>
          <Link to='/login'>
            <button onClick={this.props.onUserLogout} >Log Out</button>
          </Link>
          <br />
          <Link to='/profile'>
            <button>Profile</button>
          </Link>
          <Link to='/browse'>
            <button>Browse</button>
          </Link>
          <Link to='/matches'>
            <button>Matches</button>
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

export default withRouter(Header);