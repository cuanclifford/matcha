import React from 'react';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';

class Header extends React.Component {

  onLogOut = () => {
    localStorage.removeItem('jwt-session');
    sessionStorage.removeItem('user-data');
    this.props.history.push('/login');
  }

  isLoggedIn = () => (
    !!localStorage.getItem('jwt-session')
      ? (
        <button onClick={this.onLogOut} >Log Out</button>
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