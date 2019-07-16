import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

class Chat extends React.Component {
  render() {
    return (
      <h1>Chat Component</h1>
    );
  }
}

export default hot(module)(Chat);