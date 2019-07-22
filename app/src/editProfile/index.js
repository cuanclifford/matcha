import React from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

class EditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      sexuality: '',
      genders: [],
      sexualities: []
    }
  }

  componentDidMount() {
    const userData = JSON.parse(sessionStorage.getItem('user-data'));
    this.setState({
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      gender: userData.gender,
      sexuality: userData.sexuality
    });

    const genders = JSON.parse(sessionStorage.getItem('gender-data'));
    this.setState({ genders: genders });
  }

  onSaveChanges = async () => {
    try {
      console.log('saving...');
      await axios.post(
        'http://localhost:3001/user',
        {
          username: this.state.username,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          gender: this.state.gender,
          sexuality: this.state.sexuality
        },
        {
          headers: {
            'Authentication': 'Bearer ' + localStorage.getItem('jwt-session')
          }
        }
      );
      console.log('done');
    } catch (e) {
      console.log(e.message || e);
    }
  }

  render() {
    return (
      <div>
        <h1>EditProfile Component</h1>
        <label>
          Username:
          <input
            type='text'
            value={this.state.username}
            onChange={(event) => { this.setState({ username: event.target.value }); }}
          ></input>
        </label>

        <label>
          First Name:
          <input
            type='text'
            value={this.state.firstName}
            onChange={(event) => { this.setState({ firstName: event.target.value }); }}
          ></input>
        </label>

        <label>
          Last Name:
          <input
            type='text'
            value={this.state.lastName}
            onChange={(event) => { this.setState({ lastName: event.target.value }); }}
          ></input>
        </label>

        <label>
          Email:
          <input
            type='email'
            value={this.state.email}
            onChange={(event) => { this.setState({ email: event.target.value }); }}
          ></input>
        </label>

        <label>
          Gender:
          {
            this.state.genders && this.state.genders.map((value, index) => (
              <label key={index}>
                {value.gender}
                <input
                  type='radio'
                  checked={this.state.gender === value.id}
                  onChange={() => { this.setState({ gender: value.id }); }}
                ></input>
              </label>
            ))
          }
        </label>

        {/* <label>
          Sexuality:
          {
            this.state.sexualities && this.state.sexualities.map((value, index) => (
              <label key={index}>
                {value.sexuality}
                <input
                  type='radio'
                  checked={this.state.sexuality === value.sexuality}
                  onChange={() => { this.setState({ sexuality: value.sexuality }); }}
                ></input>
              </label>
            ))
          }
        </label> */}

        <button onClick={this.onSaveChanges}>Save Changes</button>
      </div>
    );
  }
}

export default hot(module)(EditProfile);