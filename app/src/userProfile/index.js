import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class UserProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      gender: '',
      sexuality: '',
      biography: '',
      birthdate: '',
    }
  }

  componentDidMount() {
    this.setState({
      username: this.props.username,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      gender: this.props.gender,
      sexuality: this.props.sexuality,
      biography: this.props.biography,
      birthdate: this.props.birthdate,
    });
  }

  render() {
    const {
      username,
      firstName,
      lastName,
      gender,
      sexuality,
      biography,
      birthdate
    } = this.state;

    return (
      <div>
        <h1>UserProfile Component</h1>
        <Link to="edit-profile">
          <button>Edit</button>
        </Link>
        <br />
        <span>Username: {username}</span>
        <br />
        <span>First Name: {firstName}</span>
        <br />
        <span>Last Name: {lastName}</span>
        <br />
        <span>Gender: {gender}</span>
        <br />
        <span>Sexuality: {sexuality}</span>
        <br />
        <span>Biography: {biography}</span>
        <br />
        <span>Birthdate: {birthdate}</span>
      </div>
    );
  }
}

export default UserProfile;