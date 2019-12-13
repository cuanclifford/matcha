import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class EditProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      genderId: NaN,
      sexualityId: NaN,
      genders: [],
      sexualities: [],
    };
  }

  componentDidMount() {
    this.setState({
      username: this.props.username,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      genderId: this.props.genderId,
      sexualityId: this.props.sexualityId,
      biography: this.props.biography,
      birthdate: this.props.birthdate.split('T')[0],
    });

    this.onGetGenders();
    this.onGetSexualities();
  }

  onGetGenders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/genders');

      if (res.status === 200 && res.data.length != 0) {
        this.setState({ genders: res.data });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onGetSexualities = async () => {
    try {
      const res = await axios.get('http://localhost:3001/sexualities');

      if (res.status === 200 && res.data.length != 0) {
        this.setState({ sexualities: res.data });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onSaveChanges = async () => {
    // TODO: Validation

    await this.onSaveUserInfo();
    await this.onSaveProfileInfo();
  }

  onSaveUserInfo = async () => {
    try {
      await axios.put(
        'http://localhost:3001/user',
        {
          username: this.state.username,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
        }
      );

      this.props.onSetUserInfo({
        username: this.state.username,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
      })
    } catch (e) { console.log(e.message || e); }
  }

  onSaveProfileInfo = async () => {
    try {
      await axios.put(
        'http://localhost:3001/profile',
        {
          gender_id: this.state.genderId,
          sexuality_id: this.state.sexualityId,
          biography: this.state.biography,
          birthdate: this.state.birthdate,
        }
      );

      this.props.onSetProfileInfo({
        gender_id: this.state.genderId,
        sexuality_id: this.state.sexualityId,
        gender: this.state.genders[this.state.genderId - 1].gender,
        sexuality: this.state.sexualities[this.state.sexualityId - 1].sexuality,
        biography: this.state.biography,
        birthdate: this.state.birthdate,
      });
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    const {
      username,
      firstName,
      lastName,
      genderId,
      sexualityId,
      biography,
      birthdate,
      genders,
      sexualities,
    } = this.state;

    return (
      <div>
        <h1>EditProfile Component</h1>

        <label>
          Username:
          <input
            type='text'
            value={username}
            onChange={(event) => { this.setState({ username: event.target.value }); }}
          ></input>
        </label>
        <br />

        <label>
          First Name:
          <input
            type='text'
            value={firstName}
            onChange={(event) => { this.setState({ firstName: event.target.value }); }}
          ></input>
        </label>
        <br />

        <label>
          Last Name:
          <input
            type='text'
            value={lastName}
            onChange={(event) => { this.setState({ lastName: event.target.value }); }}
          ></input>
        </label>
        <br />

        <label>
          Gender:
          {
            genders.length && genders.map((value, index) => (
              <label key={index}>
                {value.gender}
                <input
                  type='radio'
                  checked={genderId === value.id}
                  onChange={() => { this.setState({ genderId: value.id }); }}
                ></input>
                <span> </span>
              </label>
            ))
          }
        </label>
        <br />

        <label>
          Sexuality:
          {
            sexualities && sexualities.map((value, index) => (
              <label key={index}>
                {value.sexuality}
                <input
                  type='radio'
                  checked={sexualityId === value.id}
                  onChange={() => { this.setState({ sexualityId: value.id }); }}
                ></input>
              </label>
            ))
          }
        </label>
        <br />

        <label>
          Biography:
          <textarea
            value={biography || ""}
            onChange={(event) => { this.setState({ biography: event.target.value }); }}
          ></textarea>
        </label>
        <br />

        <label>
          Birthdate:
          <input
            type="date"
            value={birthdate || ""}
            onChange={(event) => { this.setState({ birthdate: event.target.value }); }}
          />
        </label>
        <br />

        <button onClick={this.onSaveChanges}>Save Changes</button>
        <br />

        <Link to="/change-email">
          <button>Change Email</button>
        </Link>
        <br />

        <Link to="/change-password">
          <button>Change Password</button>
        </Link>
        <br />

        <Link to="/edit-interests">
          <button>Edit Interests</button>
        </Link>
        <br />

        <Link to="/edit-images">
          <button>Edit Images</button>
        </Link>
      </div>
    );
  }
}

export default EditProfile;