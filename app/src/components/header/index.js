import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

import './header.css';

import {
  ButtonGroup,
  Button,
  Navbar,
  Nav,
  Dropdown,
  Toast
} from 'react-bootstrap';

const UPSTREAM_URI = 'http://localhost:3001';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      newNotifications: false
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.socket = io.connect(`${UPSTREAM_URI}/notifications`);
      this.socket.emit('join', this.props.userId);
      this.socket.on('notification', this.onReceivedNotification);
      this.onGetNotifications();
    } else {
      if (this.socket) {
        this.socket.disconnect();
      }
    }
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  onGetNotifications = async () => {
    try {
      const res = await axios.get(`${UPSTREAM_URI}/notifications`);

      this.setState({
        notifications: res.data
      });
    } catch (e) {
      console.log(e.message || e);
    }
  }

  onReceivedNotification = (notification) => {
    this.setState({
      notifications: [...this.state.notifications, notification],
      newNotifications: true
    });

    setTimeout(2000, () => this.setState({ newNotifications: false }));
  }

  onRemoveNotification = async (notificationId, index) => {
    try {
      await axios.delete(`${UPSTREAM_URI}/notification?notificationId=${notificationId}`);

      let notifications = Array.from(this.state.notifications);
      notifications.splice(index, 1);

      this.setState({
        notifications: notifications
      });
    } catch (e) {
      console.log(e.message || e);
    }
  }

  onRemoveAllNotifications = async () => {
    try {
      for (let notification of this.state.notifications) {
        await axios.delete(`${UPSTREAM_URI}/notification?notificationId=${notification.id}`);
      }

      this.setState({
        notifications: []
      });
    } catch (e) {
      console.log(e.message || e);
    }
  }

  onShowNotifications = () => {
    this.setState({ newNotifications: false });
  }

  render() {
    const {
      notifications,
      newNotifications
    } = this.state;

    return (
      <Navbar collapseOnSelect expand='sm'>
        <Navbar.Brand href='/home'>
          <img
            alt=''
            src='/matcha-favicon.png'
            className='header-icon mr-1'
          />
          Matcha
      </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        {
          this.props.isAuthenticated ? (
            <React.Fragment>
              <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav className='mr-auto'>
                  <Nav.Item>
                    <Nav.Link href='/'>Home</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href='/profile'>Profile</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href='/browse'>Browse</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href='/matches'>Matches</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Nav>
                  <Nav.Item>
                    <Dropdown
                      alignRight
                      className='m-2'
                      onToggle={this.onShowNotifications}
                    >
                      <Dropdown.Toggle
                        size='sm'
                        variant={newNotifications ? 'success' : 'primary'}
                      >i</Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <Button
                            variant='outline-dark'
                            size='sm'
                            onClick={this.onRemoveAllNotifications}
                          >
                            Clear all
                          </Button>
                        </Dropdown.Item>
                        {
                          notifications
                            .map((notification, index) => (
                              <Dropdown.Item
                                key={index}
                              >
                                <Toast onClose={() => this.onRemoveNotification(notification.id, index)}>
                                  <Toast.Header>
                                    {notification.notification}
                                  </Toast.Header>
                                </Toast>
                              </Dropdown.Item>
                            ))
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                  </Nav.Item>
                  <Button
                    variant='danger'
                    size='sm'
                    onClick={this.props.onUserLogout}
                  >
                    Logout
                  </Button>
                </Nav>
              </Navbar.Collapse>
            </React.Fragment>
          )
            : (
              <React.Fragment>
                <Navbar.Collapse id='responsive-navbar-nav'>
                  <Nav className='mr-auto'>
                    <Nav.Item>
                      <Nav.Link href='/'>Home</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Nav>
                    <ButtonGroup>
                      <Button
                        variant='outline-primary'
                        onClick={() => this.props.history.push('/login')}
                      >
                        Log In
                  </Button>
                      <Button
                        variant='primary'
                        onClick={() => this.props.history.push('/register')}
                      >
                        Register
                  </Button>
                    </ButtonGroup>
                  </Nav>
                </Navbar.Collapse>
              </React.Fragment>
            )
        }
      </Navbar>
    );
  }
}

export default withRouter(Header);