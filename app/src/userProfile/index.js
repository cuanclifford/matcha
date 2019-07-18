import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class UserProfile extends React.Component {

  onLogOut() {
    axios.delete(
      'http://localhost:3001/logout',
    )
      .then(() => { this.props.history.push('/login'); })
      .catch((e) => { console.log(e.message || e); });
  }

  render() {
    return (
      <div>
        <h1>UserProfile Component</h1>
        <button onClick={ this.onLogOut }>Log Out</button>
      </div>
    );
  }
}

export default hot(module)(UserProfile);