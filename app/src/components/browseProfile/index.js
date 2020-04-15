import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';

import {
  Card,
  Button,
  ButtonGroup,
  Carousel
} from 'react-bootstrap';

const UPSTREAM_URI = `http://localhost:3001`;

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
      images: [],
      reported: false
    }
  }

  params = this.props.match.params;

  componentDidMount() {
    this.initData();
  }

  componentWillUnmount() {

  }

  initData = async () => {
    const blocked = await this.getBlocked();

    if (blocked) {
      this.props.history.push('/browse');
      return;
    }

    this.onGetImages();
    this.getUserInfo();
    this.getProfileInfo();
    this.getLiked();
    this.getReported();
    this.setState({ userId: this.params.userId });
  }

  getBlocked = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/block?userId=` + this.params.userId);

      if (res.status === 200) {
        return res.data;
      }
    } catch (e) { console.log(e.message || e); }

    return false;
  }

  getUserInfo = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/user?userId=` + this.params.userId);

      this.setState({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        username: res.data.username,
      });
    } catch (e) { console.log(e.message || e); }
  }

  getProfileInfo = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/profile?userId=${this.params.userId}&action=view`);

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
      const res = await axios.get(`${UPSTREAM_URI}/user-images?userId=${this.params.userId}`);

      this.setState({ images: res.data.images });
    } catch (e) {
      console.log(e.message || e);
    }
  }

  getLiked = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/likes?userId=` + this.params.userId);

      if (res.status === 200) {
        this.setState({ liked: true });
        await this.getMatched();
      }
    } catch (e) { console.log(e.message || e); }
  }

  onLikeUser = async () => {
    try {
      const res = await axios.post(`${UPSTREAM_URI}/like`, { targetId: this.params.userId });

      if (res.status === 200) {
        this.setState({ liked: true });
        await this.getMatched();
      }
    } catch (e) { console.log(e.message || e); }
  }

  onUnlikeUser = async () => {
    try {
      const res = await axios.delete(`${UPSTREAM_URI}/like`, { data: { targetId: this.params.userId } });

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
      const res = await axios.get(`${UPSTREAM_URI}/match?userId=` + this.params.userId);

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
      const res = await axios.post(`${UPSTREAM_URI}/block`, { targetId: this.params.userId });

      if (res.status === 200) {
        this.props.history.push('/browse');
      }
    } catch (e) { console.log(e.message || e); }
  }

  getReported = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/reported?targetId=${this.params.userId}`);

      if (res.status === 200) {
        this.setState({ reported: res.data.reported });
      }
    } catch (e) {
      console.log(e.message || e);
    }
  }

  onReportUser = async () => {
    try {
      const res = await axios.post(`${UPSTREAM_URI}/report`, { targetId: this.params.userId });

      if (res.status === 201) {
        this.setState({ reported: true });
      }
    } catch (e) {
      console.log(e.message || e);
    }
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
      images,
      reported
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

        <div className='flex-spaced-around'>
          <ButtonGroup>
            <Button
              size='sm'
              variant='outline-danger'
              onClick={this.onBlockUser}
            >
              Block
            </Button>
            <Button
              size='sm'
              variant='outline-danger'
              disabled={reported}
              onClick={this.onReportUser}
            >
              {
                reported
                  ? 'Reported'
                  : 'Report'
              }
            </Button>
          </ButtonGroup>
        </div>
      </div >
    );
  }
}

export default withRouter(BrowseProfile);