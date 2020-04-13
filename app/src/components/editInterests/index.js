import React from 'react';
import axios from 'axios';
import Title from '../generic/title';

import './editInterests.css';

import {
  Card,
  Button
} from 'react-bootstrap';

const UPSTREAM_URI = `http://localhost:3001`;

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
      const res = await axios.get(`${UPSTREAM_URI}/interests`);

      if (res.status === 200) {
        this.setState({ interests: res.data });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onGetUserInterests = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/user-interests`);

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
      await axios.post(`${UPSTREAM_URI}/user-interest`, { interest_id: interest_id });

      const newUserInterests = this.state.userInterests;
      newUserInterests.push({ interest_id: interest_id });
      this.setState({ userInterests: newUserInterests });
    } catch (e) { console.log(e.message || e); }
  }

  onRemoveInterest = async (event) => {
    const interest_id = parseInt(event.target.value);

    let newUserInterests = [...this.state.userInterests];

    for (let interest in this.state.userInterests) {
      if (newUserInterests[interest].interest_id === interest_id) {
        try {
          await axios.delete(`${UPSTREAM_URI}/user-interest`, { data: { interest_id: interest_id } });

          newUserInterests.splice(interest, 1);
          this.setState({ userInterests: newUserInterests });
        } catch (e) { console.log(e.message || e); }
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
        <Title title='Edit Interests' />

        <Card className='edit-interests-section'>
          <Card.Header>Your Interests</Card.Header>
          <Card.Body>
            {
              interests.length > 0 && userInterests.length > 0 && userInterests.map((interest) => (
                <Button
                  size='sm'
                  variant='info'
                  className='m-1'
                  key={interest.interest_id}
                  value={interest.interest_id}
                  onClick={this.onRemoveInterest}
                >
                  {interests[interest.interest_id - 1].interest}
                </Button>
              ))
            }
          </Card.Body>
        </Card>

        <Card className='edit-interests-section'>
          <Card.Header>Interests</Card.Header>
          <Card.Body>
            {
              interests.length > 0 && interests.map((interest) => (
                <Button
                  size='sm'
                  className='m-1'
                  key={interest.id}
                  value={interest.id}
                  onClick={this.onAddInterest}
                >
                  {interest.interest}
                </Button>
              ))
            }
          </Card.Body>

        </Card>
      </div>
    );
  }
}

export default EditInterests;