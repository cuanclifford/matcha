import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

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
    }
  }

  componentDidMount() {
    console.log('props', this.props);

    const { match: { params }} = this.props;

    this.setState({ userId: params.userId }, () => {
      this.getBlocked();
      this.getUserInfo();
      this.getProfileInfo();
      this.getLiked();
    });
  }

  getBlocked = async () => {
    try {
      const res = await axios.get('http://localhost:3001/block?userId=' + this.state.userId);

      console.log('blocked:', res);
    } catch (e) { console.log(e.message || e); }
  }

  getUserInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/user?userId=' + this.state.userId);

      this.setState({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        username: res.data.username,
      });
    } catch (e) { console.log(e.message || e); }
  }

  getProfileInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/profile?userId=' + this.state.userId);

      this.setState({
        gender: res.data.gender,
        sexuality: res.data.sexuality,
        biography: res.data.biography,
        birthdate: res.data.birthdate,
      });
    } catch (e) { console.log(e.message || e); }
  }

  getLiked = async () => {
    try {
      const res = await axios.get('http://localhost:3001/likes?userId=' + this.state.userId);

      if (res.status === 200) {
        this.setState({ liked: true });
        await this.getMatched();
      }
    } catch (e) { console.log(e.message || e); }
  }

  onLikeUser = async () => {
    try {
      const res = await axios.post('http://localhost:3001/like', { targetId: this.state.userId });

      if (res.status === 200) {
        this.setState({ liked: true });
        await this.getMatched();
      }
    } catch (e) { console.log(e.message || e); }
  }

  onUnlikeUser = async () => {
    try {
      const res = await axios.delete('http://localhost:3001/like', { data: { targetId: this.state.userId }});

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
      const res = await axios.get('http://localhost:3001/match?userId=' + this.state.userId);

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
      const res = await axios.post('http://localhost:3001/block', { targetId: this.state.userId });

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
    } = this.state;

    return (
      <div>
        <h1>BrowseProfile Component</h1>
        <span>Username: {username}</span>
        <br />
        <span>First Name: {firstName}</span>
        <br />
        <span>Last Name: {lastName}</span>
        <br />
        <span>Gender: {gender}</span>
        <br />
        <span>Sexuality: {sexuality}</span>
        <br />
        <span>Biography: {biography}</span>
        <br />
        <span>Birthdate: {birthdate.split('T')[0]}</span>
        <br />
        {
          this.state.matched
          ? <button onClick={this.onUnlikeUser}>Unmatch</button>
          : this.state.liked
            ? <button onClick={this.onUnlikeUser}>Unlike</button>
            : <button onClick={this.onLikeUser}>Like</button>
        }
        <br />
        {
          this.state.matched
          ? <Link
            to={{
              pathname: '/chat/' + this.state.matchId,
              state: { targetUsername: username },
            }}
          >
              <button>Chat</button>
            </Link>
          : null
        }
        <button onClick={this.onBlockUser}>Block</button>
        <button onClick={this.onReportUser}>Report</button>
      </div>
    );
  }
}

export default withRouter(BrowseProfile);