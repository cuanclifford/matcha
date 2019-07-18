import React from 'react';
import { Link } from 'react-router-dom'
import { hot } from 'react-hot-loader';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home Component</h1>
        <Link to='/login'>
          <button>Log In</button>
        </Link>
        <Link to='/registration'>
          <button>Sign Up</button>
        </Link>
      </div>
    );
  }
}

export default hot(module)(Home);