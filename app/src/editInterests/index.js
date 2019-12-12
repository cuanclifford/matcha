import React from 'react';
import axios from 'axios';

class EditInterests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInterests: [],
      interests: [],
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

  onAddInterest = async (event) => {
    const interest_id = parseInt(event.target.value);

    for (let interest of this.state.userInterests) {
      if (interest.interest_id === interest_id) {
        return;
      }
    }

    try {
      await axios.post('http://localhost:3001/user-interest', { interest_id: interest_id });

      const newUserInterests = this.state.userInterests;
      newUserInterests.push({interest_id: interest_id});
      this.setState({ userInterests: newUserInterests });
    } catch (e) { console.log(e.message || e); }
  }

  onRemoveInterest = async (event) => {
    const interest_id = parseInt(event.target.value);

    let newUserInterests = [ ...this.state.userInterests ];

    for (let interest in this.state.userInterests) {
      if (newUserInterests[interest].interest_id === interest_id) {
        try {
          await axios.delete('http://localhost:3001/user-interest', { data: { interest_id: interest_id }});

          newUserInterests.splice(interest, 1);
          this.setState({ userInterests: newUserInterests });
        } catch (e) { console.log(e.message ||e); }
        return;
      }
    }
  }

  render() {
    const {
      userInterests,
      interests,
    } = this.state;

    return (
      <div>
        <h1>EditInterests Component</h1>
        <label>
          <b>Your Interests:</b>
          {
            interests.length > 0 && userInterests.length > 0 && userInterests.map((interest) => (
                <button
                  key={interest.interest_id}
                  value={interest.interest_id}
                  onClick={this.onRemoveInterest}
                >
                  {interests[interest.interest_id - 1].interest}
                </button>
            ))
          }
        </label>
        <br />

        <label>
          <b>Interests:</b>
          {
            interests.length > 0 && interests.map((interest) => (
                <button
                  key={interest.id}
                  value={interest.id}
                  onClick={this.onAddInterest}
                >
                  {interest.interest}
                </button>
            ))
          }
        </label>
        <br />
      </div>
    );
  }
}

export default EditInterests;