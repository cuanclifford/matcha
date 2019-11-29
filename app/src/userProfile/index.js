import React from 'react';
import axios from 'axios';

class UserProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
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
      email: this.props.email,
    });

    this.getUserInfo();
  }

  getUserInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/profile');

      if (res.status === 200) {
        this.setState({
          gender: res.data.gender,
          sexuality: res.data.sexuality,
          biography: res.data.biography,
          birthdate: res.data.birthdate,
        });
      }
    } catch (e) { console.log(e.message || e); }
  }

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
    } = this.state;

    return (
      <div>
        <h1>UserProfile Component</h1>
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
        <span>Birthdate: {birthdate}</span>
      </div>
    );
  }
}

export default UserProfile;