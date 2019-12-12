import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class UserProfile extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      interests: [],
      userInterests: [],
    };
  }

  componentDidMount() {
    this.onGetInterests();
    this.onGetUserInterests();
  }

  onGetInterests = async () => {
    try {
      const res = await axios.get('http://localhost:3001/interests');

      if (res.status === 200) {
        this.setState({ interests: res.data });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onGetUserInterests = async () => {
    try {
      const res = await axios.get('http://localhost:3001/user-interests');

      if (res.status === 200) {
        this.setState({ userInterests: res.data });
      }
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    console.log('[UserProfile]', this.state);
    const {
      username,
      firstName,
      lastName,
      email,
      gender,
      sexuality,
      biography,
      birthdate,
    } = this.props;

    const {
      interests,
      userInterests,
    } = this.state;

    return (
      <div>
        <h1>UserProfile Component</h1>
        <br />

        <span>Username: {username}</span>
        <br />

        <span>First Name: {firstName}</span>
        <br />

        <span>Last Name: {lastName}</span>
        <br />

        <span>Email: {email}</span>
        <br />

        <span>Gender: {gender}</span>
        <br />

        <span>Sexuality: {sexuality}</span>
        <br />

        <span>Biography: {biography}</span>
        <br />

        <span>Birthdate: {birthdate.split('T')[0]}</span>
        <br />

        <label>
          Interests:
          {
            interests.length > 0 && userInterests.length > 0 && userInterests.map((interest) => (
                <span key={interest.interest_id}>{interests[interest.interest_id].interest} </span>
            ))
          }
        </label>
        <br />

        <Link to="edit-profile">
          <button>Edit</button>
        </Link>
      </div>
    );
  }
}

export default UserProfile;