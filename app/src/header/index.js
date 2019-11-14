import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = { isAuthenticated: false };
  }

  componentWillMount = async () => {
    try {
      const res = await axios.get('http://localhost:3001/user');
      this.setState({isAuthenticated: res.status === 200});
    } catch (e) { console.log(e.message || e); }
  }

  onLogOut = async () => {
    console.log('logging out');
    try {
      console.log('request sent');
      await axios.get('http://localhost:3001/logout');
      console.log('response received');

      this.setState({ isAuthenticated: false });
    } catch (e) { console.log(e.message || e); }
  }

  isLoggedIn = () => (
    this.state.isAuthenticated
      ? (
          // <Link to="/login">
            <button onClick={this.onLogOut} >Log Out</button>
          // </Link>
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