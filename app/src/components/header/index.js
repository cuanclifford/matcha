import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import './header.css';

import {
  ButtonGroup,
  Button,
  Navbar,
  Nav
} from 'react-bootstrap';

class Header extends React.Component {

  render() {
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
      <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
      <Navbar.Collapse id='responsive-navbar-nav'>
        {
          this.props.isAuthenticated ? (
            <React.Fragment>
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
                <Button onClick={this.props.onUserLogout}>Logout</Button>
              </Nav>
            </React.Fragment>
          )
          : (
            <React.Fragment>
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
                    Login
                  </Button>
                  <Button
                    variant='primary'
                    onClick={() => this.props.history.push('/register')}
                    >
                    Register
                  </Button>
                </ButtonGroup>
              </Nav>
            </React.Fragment>
          )
        }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Header);