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
  Dropdown,
  Badge,
  Accordion,
  InputGroup
} from 'react-bootstrap';

const UPSTREAM_URI = `${process.env.REACT_APP_UPSTREAM_URI}`;

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
      interests: [],
      suggestions: [],
      userInterests: [],
      filteredSuggestions: [],
      sortCriteria: 'none',
      sortType: 'none'
    }
  }

  componentDidMount() {
    this.getSuggestedProfiles();
    this.getInterests();
    this.getUserInterests();
  }

  getSuggestedProfiles = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/suggestions`);

      if (res.status === 200) {
        this.setState({
          suggestions: res.data,
          filteredSuggestions: res.data
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

  searchProfiles = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const res = await axios.post(
        `${UPSTREAM_URI}/search-profiles`,
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
          suggestions: res.data,
          filteredSuggestions: res.data
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
      const res = await axios.get(`${UPSTREAM_URI}/interests`);

      if (res.status === 200) {
        this.setState({
          interests: res.data
        });
      }
    } catch (e) {
      console.log(e.message || e);
    }
  }

  getUserInterests = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/user-interests`);

      if (res.status === 200) {
        this.setState({
          userInterests: res.data
        });
      }
    } catch (e) {
      console.log(e.message || e);
    }
  }

  onFilterSuggestions = () => {
    let filteredSuggestions = this.state.suggestions.filter((suggestion) => {
      if (suggestion.age < this.state.ageFilterMin || suggestion.age > this.state.ageFilterMax) {
        return false;
      }

      if (suggestion.rating < this.state.ratingFilterMin || suggestion.rating > this.state.ratingFilterMax) {
        return false;
      }

      for (let interestFilter of this.state.interestFilters) {
        let hasInterest = false;
        for (let interest of suggestion.interests) {
          if (interestFilter.id === interest.interest_id) {
            hasInterest = true;
            break;
          }
        }
        if (!hasInterest) {
          return false;
        }
      }

      return true;
    });

    this.setState({
      filteredSuggestions: filteredSuggestions
    })
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

  onSortSuggestions = () => {
    const {
      sortCriteria,
      sortType,
      filteredSuggestions
    } = this.state;

    let sortedSuggestions;

    if (sortCriteria === 'none' || sortType === 'none') {
      return;
    }

    if (sortCriteria === 'age') {
      if (sortType === 'ascending') {
        sortedSuggestions = filteredSuggestions.sort((a, b) => {
          return Number(a.age) - Number(b.age);
        });
      } else if (sortType === 'descending') {
        sortedSuggestions = filteredSuggestions.sort((a, b) => {
          return Number(b.age) - Number(a.age);
        });
      }
    } else if (sortCriteria === 'rating') {
      if (sortType === 'ascending') {
        sortedSuggestions = filteredSuggestions.sort((a, b) => {
          return Number(a.rating) - Number(b.rating);
        });
      } else if (sortType === 'descending') {
        sortedSuggestions = filteredSuggestions.sort((a, b) => {
          return Number(b.rating) - Number(a.rating);
        });
      }
    } else if (sortCriteria === 'interests') {
      if (sortType === 'ascending') {
        sortedSuggestions = filteredSuggestions.sort((a, b) => {
          let similarInterestCountA = this.getSharedInterestCount(a);
          let similarInterestCountB = this.getSharedInterestCount(b);

          return Number(similarInterestCountA) - Number(similarInterestCountB);
        });
      } else if (sortType === 'descending') {
        sortedSuggestions = filteredSuggestions.sort((a, b) => {
          let similarInterestCountA = this.getSharedInterestCount(a);
          let similarInterestCountB = this.getSharedInterestCount(b);

          return Number(similarInterestCountB) - Number(similarInterestCountA);
        });
      }
    }

    this.setState({
      filteredSuggestions: sortedSuggestions
    });
  }

  getSharedInterestCount = (suggestion) => {
    let sharedCount = 0;

    for (let userInterest of this.state.userInterests) {
      for (let interest of suggestion.interests) {
        if (userInterest.interest_id === interest.interest_id) {
          sharedCount++;
          break;
        }
      }
    }

    return sharedCount;
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
      filteredSuggestions
    } = this.state;

    return (
      <div>
        <Title title='Browse' />
        <Accordion>
          <Card className='mb-2'>
            <Accordion.Toggle
              as={Card.Header}
              eventKey='0'
            >
              Filter Search
            </Accordion.Toggle>
            <Accordion.Collapse eventKey='0'>
              <Form noValidate onSubmit={this.searchProfiles}>
                <Card.Body>
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
                    <Button variant='primary' onClick={this.onFilterSuggestions}>Filter</Button>
                  </div>
                </Card.Body>
              </Form>
            </Accordion.Collapse>
            <Accordion.Toggle
              as={Card.Header}
              eventKey='1'
            >
              Sort Results
            </Accordion.Toggle>
            <Accordion.Collapse eventKey='1'>
              <Card.Body>
                <InputGroup>
                  <InputGroup.Prepend>
                    <Form.Control
                      as='select'
                      size='sm'
                      onChange={(event) => this.setState({ sortCriteria: event.target.value })}
                    >
                      <option value='none'>None</option>
                      <option value='age'>Age</option>
                      <option value='rating'>Rating</option>
                      <option value='interests'>Common Interests</option>
                    </Form.Control>
                  </InputGroup.Prepend>
                  <Form.Control
                    as='select'
                    size='sm'
                    onChange={(event) => this.setState({ sortType: event.target.value })}
                  >
                    <option value='none'>None</option>
                    <option value='ascending'>Ascending</option>
                    <option value='descending'>Descending</option>
                  </Form.Control>
                  <InputGroup.Append>
                    <Button
                      variant='success'
                      size='sm'
                      onClick={this.onSortSuggestions}
                    >
                      Sort
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        {
          filteredSuggestions.map(
            suggestion => (
              <Card
                key={suggestion.username}
                className='browse-section'
                border='primary'
              >
                {
                  suggestion.images.length
                    ? (
                      <Carousel>
                        {
                          suggestion.images.map((image, index) => (
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
                    )
                    : null
                }
                <Card.Body>
                  <Card.Title>
                    <Badge className='mr-2' variant='warning'>{suggestion.rating}</Badge>
                    {suggestion.firstName} {suggestion.lastName} {suggestion.age}
                  </Card.Title>
                  <Card.Subtitle className='mb-2 text-muted'>{suggestion.sexuality} {suggestion.gender}</Card.Subtitle>
                  <Card.Text>
                    Interests:
                    <br />
                    {
                      suggestion.interests.map((userInterest, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='mr-1'
                        >
                          {interests.find((interest) => interest.id === userInterest.interest_id).interest}
                        </Badge>
                      ))
                    }
                  </Card.Text>
                  <Link to={"/profile/" + suggestion.userId} >
                    <Button size='sm'>View Profile</Button>
                  </Link>
                </Card.Body>
              </Card>
            ))
        }
      </div >
    );
  }
}

export default withRouter(Browse);