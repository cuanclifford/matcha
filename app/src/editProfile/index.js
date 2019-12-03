import React from 'react';
import axios from 'axios';

class EditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      firstName: '',
      lastName: '',
      gender_id: NaN,
      sexuality_id: NaN,
      genders: [],
      sexualities: []
    }
  }

  componentDidMount() {
    this.setState({
      username: this.props.username,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      gender_id: this.props.gender_id,
      sexuality_id: this.props.sexuality_id,
      biography: this.props.biography,
      birthdate: this.props.birthdate,
    });

    this.onGetGenders();
    this.onGetSexualities();
  }

  onGetGenders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/genders');

      if (res.data.length != 0) {
        this.setState({ genders: res.data });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onGetSexualities = async () => {
    try {
      const res = await axios.get('http://localhost:3001/sexualities');

      if (res.data.length != 0) {
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
      const res = await axios.post(
        'http://localhost:3001/user',
        {
          username: this.state.username,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
        }
      );
    } catch (e) { console.log(e.message || e); }
  }

  onSaveProfileInfo = async () => {
    try {
      await axios.post(
        'http://localhost:3001/profile',
        {
          gender_id: this.state.gender_id,
          sexuality_id: this.state.sexuality_id,
          biography: this.state.biography,
          birthdate: this.state.birthdate,
        }
      );
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    console.log(this.state);

    const {
      username,
      firstName,
      lastName,
      gender_id,
      sexuality_id,
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
                  checked={gender_id === value.id}
                  onChange={() => { this.setState({ gender_id: value.id }); }}
                ></input>
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
                  checked={sexuality_id === value.id}
                  onChange={() => { this.setState({ sexuality_id: value.id }); }}
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
            onChange={(event) => { this.setState({ birthdate: event.target.value }); }}
          />
        </label>
        <br />

        <button onClick={this.onSaveChanges}>Save Changes</button>
      </div>
    );
  }
}

export default EditProfile;