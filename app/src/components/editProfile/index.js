import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';

import './editProfile.css'

import {
  Card,
  Button,
  ButtonGroup,
  Form
} from 'react-bootstrap';

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
      });
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
        <Title title='Edit Profile' />

        <Card className='edit-profile-section'>
          <Card.Header className='card-header'>
            Details
            <ButtonGroup>
              <Button
                size='sm'
                variant='outline-primary'
                onClick={() => this.props.history.push('/change-email')}
              >
                Change Email
              </Button>
              <Button
                size='sm'
                variant='outline-primary'
                onClick={() => this.props.history.push('/change-password')}
              >
                Change Password
              </Button>
            </ButtonGroup>
          </Card.Header>
          <Card.Body>

            <Form>

              <Form.Group controlId='formUsername'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter username'
                  value={username}
                  onChange={(event) => { this.setState({ username: event.target.value }); }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your first name'
                  value={firstName}
                  onChange={(event) => { this.setState({ firstName: event.target.value }); }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your last name'
                  value={lastName}
                  onChange={(event) => { this.setState({ lastName: event.target.value }); }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Gender</Form.Label>
                {
                  genders.length && genders.map((value, index) => (
                    <Form.Check
                      key={index}
                      type='radio'
                      label={value.gender}
                      checked={genderId === value.id}
                      onChange={() => { this.setState({ genderId: value.id }); }}
                    />
                  ))
                }
              </Form.Group>

              <Form.Group>
                <Form.Label>Sexuality</Form.Label>
                {
                  sexualities.length && sexualities.map((value, index) => (
                    <Form.Check
                      key={index}
                      type='radio'
                      label={value.sexuality}
                      checked={sexualityId === value.id}
                      onChange={() => { this.setState({ sexualityId: value.id }); }}
                    />
                  ))
                }
              </Form.Group>

              <Form.Group>
                <Form.Label>Biography</Form.Label>
                <Form.Control
                  className='edit-profile-text-area'
                  as='textarea'
                  rows='4'
                  value={biography || ''}
                  onChange={(event) => { this.setState({ biography: event.target.value }); }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Birth date</Form.Label>
                <input
                  type="date"
                  value={birthdate || ""}
                  onChange={(event) => { this.setState({ birthdate: event.target.value }); }}
                />
              </Form.Group>
            </Form>

            <Button variant='success' onClick={this.onSaveChanges}>Save Changes</Button>
          </Card.Body>
        </Card>

        <div
          className='flex-spaced-evenly'
        >

        </div>
      </div>
    );
  }
}

export default withRouter(EditProfile);