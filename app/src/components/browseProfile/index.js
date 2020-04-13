import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';

import {
  Card,
  Button,
  Carousel
} from 'react-bootstrap';

const UPSTREAM_URI = `${process.env.UPSTREAM_URI}`;

class BrowseProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      liked: false,
      matched: false,
      matchId: '',
      userId: '',
      firstName: '',
      lastName: '',
      username: '',
      gender: '',
      sexuality: '',
      biography: '',
      birthdate: '',
      images: []
    }
  }

  componentDidMount() {
    const { match: { params } } = this.props;

    this.setState({ userId: params.userId }, () => {
      this.onGetImages();
      this.getBlocked();
      this.getUserInfo();
      this.getProfileInfo();
      this.getLiked();
    });
  }

  getBlocked = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/block?userId=` + this.state.userId);

      console.log('blocked', res);
    } catch (e) { console.log(e.message || e); }
  }

  getUserInfo = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/user?userId=` + this.state.userId);

      this.setState({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        username: res.data.username,
      });
    } catch (e) { console.log(e.message || e); }
  }

  getProfileInfo = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/profile?userId=` + this.state.userId);

      this.setState({
        gender: res.data.gender,
        sexuality: res.data.sexuality,
        biography: res.data.biography,
        birthdate: res.data.birthdate,
      });
    } catch (e) { console.log(e.message || e); }
  }

  onGetImages = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/user-images?userId=${this.state.userId}`);

      this.setState({ images: res.data.images });
    } catch (e) {
      console.log(e.message || e);
    }
  }

  getLiked = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/likes?userId=` + this.state.userId);

      if (res.status === 200) {
        this.setState({ liked: true });
        await this.getMatched();
      }
    } catch (e) { console.log(e.message || e); }
  }

  onLikeUser = async () => {
    try {
      const res = await axios.post(`${UPSTREAM_URI}/like`, { targetId: this.state.userId });

      if (res.status === 200) {
        this.setState({ liked: true });
        await this.getMatched();
      }
    } catch (e) { console.log(e.message || e); }
  }

  onUnlikeUser = async () => {
    try {
      const res = await axios.delete(`${UPSTREAM_URI}/like`, { data: { targetId: this.state.userId } });

      if (res.status == 200) {
        this.setState({
          liked: false,
          matched: false,
          matchId: '',
        });
      }
    } catch (e) { console.log(e.message || e); }
  }

  getMatched = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/match?userId=` + this.state.userId);

      if (res.status === 200) {
        this.setState({
          matchId: res.data.id,
          matched: true,
        });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onBlockUser = async () => {
    try {
      const res = await axios.post(`${UPSTREAM_URI}/block`, { targetId: this.state.userId });

      if (res.status === 200) {
        this.props.history.push('/browse');
      }
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    const {
      username,
      firstName,
      lastName,
      gender,
      sexuality,
      biography,
      birthdate,
      images
    } = this.state;

    return (
      <div>
        <Title title={`${firstName} ${lastName}`} />

        <Card className='mb-2'>
          <Carousel>
            {
              images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={`${UPSTREAM_URI}/${image.path}`}
                    height='300px'
                    className='carousel-image'
                  />
                </Carousel.Item>
              ))
            }
          </Carousel>
          <Card.Body>
            <Card.Text>{biography}</Card.Text>
            <Card.Text>Username: {username}</Card.Text>
            <Card.Text>Gender: {gender}</Card.Text>
            <Card.Text>Sexuality: {sexuality}</Card.Text>
            <Card.Text>Birthdate: {birthdate.split('T')[0]}</Card.Text>
            {
              this.state.matched
                ? (
                  <div className='flex-spaced-around'>
                    <Button
                      size='sm'
                      variant='outline-danger'
                      onClick={this.onUnlikeUser}
                    >
                      Unmatch
                  </Button>

                    <Link
                      to={{
                        pathname: '/chat/' + this.state.matchId,
                        state: { targetUsername: username },
                      }}
                    >
                      <Button size='sm'>Chat</Button>
                    </Link>
                  </div>
                )
                : this.state.liked
                  ? <Button
                    size='sm'
                    variant='outline-danger'
                    onClick={this.onUnlikeUser}
                  >
                    Unlike
                  </Button>
                  : <Button
                    size='sm'
                    variant='success'
                    onClick={this.onLikeUser}
                  >
                    Like
                  </Button>
            }
          </Card.Body>
        </Card>

        <Button
          variant='danger'
          onClick={this.onBlockUser}
        >
          Block
        </Button>
        <Button
          variant='danger'
          onClick={this.onReportUser}
          className='ml-1'
        >
          Report
        </Button>
      </div >
    );
  }
}

export default withRouter(BrowseProfile);