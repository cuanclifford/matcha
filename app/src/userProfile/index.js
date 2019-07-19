import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class UserProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      email: ''
    }
  }

  onLogOut = () => {
    localStorage.removeItem('jwtAuth');
    this.props.history.push('/login');
  }

  componentDidMount() {
    axios.get(
      'http://localhost:3001/user',
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('jwtAuth')
        }
      }
    )
      .then((res) => {
        this.setState({
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email
        });
      })
      .catch((e) => { console.log(e.message || e); })
  }

  render() {
    return (
      <div>
        <h1>UserProfile Component</h1>
        <button onClick={this.onLogOut}>Log Out</button>
        <p>Username: {this.state.username}</p>
        <p>First Name: {this.state.firstName}</p>
        <p>Last Name: {this.state.lastName}</p>
        <p>Email: {this.state.email}</p>
      </div>
    );
  }
}

export default hot(module)(UserProfile);