import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';

class Browse extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      suggestions: []
    }
  }

  componentDidMount() {
    this.getSuggestedProfiles();
  }

  getSuggestedProfiles = async () => {
    try {
      const res = await axios.get('http://localhost:3001/suggestions');

      if (res.status === 200) {
        console.log('Response:', res.data);
        this.setState({
          suggestions: res.data
        });
      }
    } catch (e) {
      console.log(e.message || e);
      this.props.history.push('/profile');
    }
  }

  render() {
    const {
      suggestions
    } = this.state;

    return (
      <div>
        <h1>Browse Component</h1>
        <h3>Suggestions</h3>
        {
          suggestions.map(
            suggestion => <div key={suggestion.username}>
              <span>Firstname: {suggestion.firstName}</span>
              <br />
              <span>Lastname: {suggestion.lastName}</span>
              <br />
              <span>Username: {suggestion.username}</span>
              <br />
              <span>Gender: {suggestion.gender}</span>
              <br />
              <span>Sexuality: {suggestion.sexuality}</span>
              <br />
              <Link to={"/profile/" + suggestion.userId} >
                <button>View Profile</button>
              </Link>
              <br />
              <br />
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(Browse);