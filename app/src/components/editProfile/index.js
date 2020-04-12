import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';
import { Validation } from '../../validation/validation';

import './editProfile.css'

import {
  Card,
  Button,
  ButtonGroup,
  Form,
  Alert
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
      biographt: '',
      birthdate: '',
      genders: [],
      sexualities: [],
      hasSubmitted: false,
      isValidUsername: false,
      isValidFirstName: false,
      isValidLastName: false,
      badRequestError: ''
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
      isValidUsername: Validation.isValidUsername(this.props.username),
      isValidFirstName: Validation.isValidFirstName(this.props.firstName),
      isValidLastName: Validation.isValidLastName(this.props.lastName),
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

  onSaveChanges = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      hasSubmitted: true,
      badRequestError: ''
    });

    if (!(
      this.state.isValidUsername
      && this.state.isValidFirstName
      && this.state.isValidLastName
      && !!this.state.genderId
      && !!this.state.sexualityId
      && !!this.state.birthdate
    )) {
      return;
    }

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
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({ badRequestError: e.response.data });
      } else {
        console.log(e.message || e);
      }
    }
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
    } catch (e) {
      if (e.response.status === 400) {
        this.setState({ badRequestError: e.response.data });
      } else {
        console.log(e.message || e);
      }
    }
  }

  onChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
      isValidUsername: Validation.isValidUsername(event.target.value)
    });
  }

  onChangeFirstName = (event) => {
    this.setState({
      firstName: event.target.value,
      isValidFirstName: Validation.isValidFirstName(event.target.value)
    });
  }

  onChangeLastName = (event) => {
    this.setState({
      lastName: event.target.value,
      isValidLastName: Validation.isValidLastName(event.target.value)
    });
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
      hasSubmitted,
      isValidUsername,
      isValidFirstName,
      isValidLastName,
      badRequestError
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
          {
            !!badRequestError && (
              <Alert variant='danger'>{badRequestError}</Alert>
            )
          }
          <Card.Body>

            <Form noValidate onSubmit={this.onSaveChanges}>
              <Form.Group controlId='formUsername'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter username'
                  isInvalid={hasSubmitted && !isValidUsername}
                  value={username}
                  onChange={this.onChangeUsername}
                />
                <Form.Control.Feedback type='invalid'>Invalid username</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your first name'
                  isInvalid={hasSubmitted && !isValidFirstName}
                  value={firstName}
                  onChange={this.onChangeFirstName}
                />
                <Form.Control.Feedback type='invalid'>Invalid first name</Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your last name'
                  isInvalid={hasSubmitted && !isValidLastName}
                  value={lastName}
                  onChange={this.onChangeLastName}
                />
                <Form.Control.Feedback type='invalid'>Invalid last name</Form.Control.Feedback>
              </Form.Group>

              {
                hasSubmitted && !genderId && (
                  <Alert variant='danger'>You must select a gender</Alert>
                )
              }
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

              {
                hasSubmitted && !sexualityId && (
                  <Alert variant='danger'>You must select a sexuality</Alert>
                )
              }
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
                <br />
                <Form.Control
                  type='date'
                  isInvalid={hasSubmitted && !birthdate}
                  value={birthdate || ''}
                  onChange={(event) => { this.setState({ birthdate: event.target.value }) }}
                />
                <Form.Control.Feedback type='invalid'>
                  Invalid birth date
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant='success' type='submit'>Save Changes</Button>
            </Form>

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