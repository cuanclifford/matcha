import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './userProfile.css';

import {
  Card,
  Button,
  Badge,
  Image,
  Carousel
} from 'react-bootstrap';

class UserProfile extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      images: [],
      interests: [],
      userInterests: [],
    };
  }

  componentDidMount() {
    this.onGetImages();
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

  onGetImages = async () => {
    try {
      const res = await axios.get('http://localhost:3001/user-images');

      this.setState({ images: res.data.images });

    } catch (e) {
      console.log(e.message || e);
    }
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
      birthdate,
    } = this.props;

    const {
      images,
      interests,
      userInterests,
    } = this.state;

    return (
      <div>
        <h1>Your Profile</h1>

        <Card className='user-profile-section'>
          <Card.Header as='h5'>Pictures</Card.Header>
          <Carousel
            className='mb-2'
            interval={null}
            slide={false}
          >
            {
              images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={`http://localhost:3001/${image.path}`}
                    height='300px'
                    className='carousel-image'
                  />
                </Carousel.Item>
              ))
            }
          </Carousel>

          <Card.Body>
            <Link to="edit-images">
              <Button size='sm'>Edit</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card className='user-profile-section'>
          <Card.Header as='h5'>Details</Card.Header>
          <Card.Body>
            <Card.Text>Username: {username}</Card.Text>
            <Card.Text>First Name: {firstName}</Card.Text>
            <Card.Text>Last Name: {lastName}</Card.Text>
            <Card.Text>Email: {email}</Card.Text>
            <Card.Text>Gender: {gender}</Card.Text>
            <Card.Text>Sexuality: {sexuality}</Card.Text>
            <Card.Text>Biography: {biography}</Card.Text>
            <Card.Text>Birthdate: {birthdate.split('T')[0]}</Card.Text>

            <Link to="edit-profile">
              <Button size='sm'>Edit</Button>
            </Link>

          </Card.Body>
        </Card>

        <Card className='user-profile-section'>
          <Card.Header>Interests</Card.Header>
          <Card.Body>
            <div className='mb-2'>
              {
                interests.length > 0 && userInterests.length > 0 && userInterests.map((interest) => (
                    <Badge
                      className='ml-1'
                      variant='secondary'
                      key={interest.interest_id}
                    >
                      {interests[interest.interest_id - 1].interest}
                    </Badge>
                ))
              }
            </div>

            <Link to="edit-interests">
              <Button size='sm'>Edit</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default UserProfile;