import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';

import './browse.css';

import {
  Card,
  Button,
  Carousel
} from 'react-bootstrap';

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
        <Title title='Suggestions' />
        {
          suggestions.map(
            suggestion => (
              <Card
                key={suggestion.username}
                className='browse-section'
              >
                {
                  suggestion.images.length
                    ? (
                      <Carousel>
                        {
                          suggestion.images.map((image, index) => (
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
                    )
                    : null
                }
                <Card.Body>
                  <Card.Text>{suggestion.firstName} {suggestion.lastName}</Card.Text>
                  <Card.Text>{suggestion.gender}</Card.Text>
                  <Card.Text>{suggestion.sexuality}</Card.Text>
                  <Link to={"/profile/" + suggestion.userId} >
                    <Button size='sm'>View Profile</Button>
                  </Link>
                </Card.Body>
              </Card>
            ))
        }
      </div>
    );
  }
}

export default withRouter(Browse);