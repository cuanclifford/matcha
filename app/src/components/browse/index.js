import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Title from '../generic/title';

import './browse.css';

import {
  Card,
  Button,
  Carousel,
  Form,
  Dropdown
} from 'react-bootstrap';

class Browse extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ageFilterMin: 18,
      ageFilterMax: 80,
      ratingFilterMin: 0,
      ratingFilterMax: 1,
      // locationFilter: '',
      interestFilters: [],
      interests: [{ interest: 'ass' }],
      suggestions: []
    }
  }

  componentDidMount() {
    this.getSuggestedProfiles();
    this.getInterests();
  }

  getSuggestedProfiles = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.setState({
      suggestions: []
    });

    try {
      const res = await axios.post(
        'http://localhost:3001/suggestions',
        {
          minAge: Number(this.state.ageFilterMin),
          maxAge: Number(this.state.ageFilterMax),
          minRating: Number(this.state.ratingFilterMin),
          maxRating: Number(this.state.ratingFilterMax),
          interests: this.state.interestFilters
        }
      );

      if (res.status === 200) {
        this.setState({
          suggestions: res.data
        });
      }
    } catch (e) {
      if (e.response.status === 400) {
        this.props.history.push('/profile');
      } else {
        console.log(e.message || e);
      }
    }
  }

  getInterests = async () => {
    try {
      const res = await axios.get('http://localhost:3001/interests');
      console.log(res);

      if (res.status === 200) {
        this.setState({
          interests: res.data
        });
      }
    } catch (e) {
      console.log(e.message || e);
    }
  }

  onAddInterestFilter = (interest) => {
    if (this.state.interestFilters.find((interestFilter) => interestFilter === interest)) {
      return;
    }

    this.setState({
      interestFilters: this.state.interestFilters.concat([interest])
    });
  }

  onRemoveInterestFilter = (interest) => {
    let interestFilters = this.state.interestFilters;

    interestFilters.splice(interest, 1);
    this.setState({
      interestFilters: interestFilters
    });
  }

  render() {
    const {
      ageFilterMin,
      ageFilterMax,
      ratingFilterMin,
      ratingFilterMax,
      // locationFilter,
      interestFilters,
      interests,
      suggestions
    } = this.state;

    return (
      <div>
        <Title title='Suggestions' />
        <Card className='mb-2'>
          <Card.Header>Filter Search</Card.Header>
          <Card.Body>
            <Form noValidate onSubmit={this.getSuggestedProfiles}>
              <Form.Row className='flex-spaced-evenly'>
                <Form.Group className='browse-range-input'>
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type='range'
                    custom
                    min={18}
                    max={ageFilterMax}
                    step={1}
                    value={ageFilterMin}
                    onChange={(event) => { this.setState({ ageFilterMin: event.target.value }); }}
                  />
                  <Form.Control
                    type='range'
                    custom
                    min={ageFilterMin}
                    max={80}
                    step={1}
                    value={ageFilterMax}
                    onChange={(event) => { this.setState({ ageFilterMax: event.target.value }); }}
                  />
                  <Form.Text>{ageFilterMin} - {ageFilterMax}</Form.Text>
                </Form.Group>
                <Form.Group className='browse-range-input'>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type='range'
                    custom
                    min={0}
                    max={ratingFilterMax}
                    step={0.01}
                    value={ratingFilterMin}
                    onChange={(event) => { this.setState({ ratingFilterMin: event.target.value }); }}
                  />
                  <Form.Control
                    type='range'
                    custom
                    min={ratingFilterMin}
                    max={1}
                    step={0.01}
                    value={ratingFilterMax}
                    onChange={(event) => { this.setState({ ratingFilterMax: event.target.value }); }}
                  />
                  <Form.Text>{ratingFilterMin} - {ratingFilterMax}</Form.Text>
                </Form.Group>
              </Form.Row>
              <Form.Group>
                <Dropdown className='mb-2'>
                  <Dropdown.Toggle size='sm' variant='primary'>
                    Interests
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      interests
                        .filter((interest) => !interestFilters.includes(interest))
                        .map((interest, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => this.onAddInterestFilter(interest)}
                          >
                            {interest.interest}
                          </Dropdown.Item>
                        ))
                    }
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Text>
                  {
                    interestFilters.map((interestFilter, index) => (
                      <Button
                        key={index}
                        size='sm'
                        variant='info'
                        className='mr-1 mb-1'
                        onClick={() => this.onRemoveInterestFilter(interestFilter)}
                      >
                        {interestFilter.interest}
                      </Button>
                    ))
                  }
                </Form.Text>
              </Form.Group>
              <div className='flex-spaced-around'>
                <Button variant='success' type='submit'>Search</Button>
                <Button variant='primary'>Filter Results</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
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