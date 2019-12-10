import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class UserProfile extends React.Component {
  render() {
    const {
      username,
      firstName,
      lastName,
      email,
      gender,
      sexuality,
      biography,
      birthdate
    } = this.props;

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
        <Link to="edit-profile">
          <button>Edit</button>
        </Link>
      </div>
    );
  }
}

export default UserProfile;