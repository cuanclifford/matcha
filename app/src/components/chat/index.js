import React from 'react';
import axios from 'axios';
import Title from '../generic/title';

import './chat.css';

import {
  Alert,
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      messagesReversed: [],
      message: ''
    };
  }

  componentDidMount() {
    this.getMessages();
  }

  getMessages = async () => {
    const { match: { params } } = this.props;

    try {
      const res = await axios.get('http://localhost:3001/messages?matchId=' + params.matchId);

      if (res.status === 200) {
        const messages = res.data;
        const messagesReversed = Array.from(messages);
        messagesReversed.reverse();
        this.setState({
          messages: messages,
          messagesReversed: messagesReversed
        });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onSendMessage = async () => {
    const { match: { params } } = this.props;

    let message = this.state.message.trim();

    if (message) {
      try {
        await axios.post(
          'http://localhost:3001/message',
          {
            matchId: params.matchId,
            chatMessage: message,
          }
        );

        await this.getMessages();
      } catch (e) { console.log(e.message || e); }
    }

    this.setState({ message: '' });
  }

  render() {
    const {
      messagesReversed,
      message
    } = this.state;
    const { targetUsername } = this.props.location.state;

    return (
      <div className='chat-container'>
        <Title title={targetUsername} />
        <div className='chat-message-container'>
          {
            messagesReversed.map((message, index) => <React.Fragment key={index}>
              {
                message.user_id === this.props.userId
                  ? (
                    <div className='chat-your-message'>
                      <Alert
                        variant='success'
                      >
                        {message.chat_message}
                      </Alert>
                    </div>
                  ) : (
                    <div className='chat-target-message'>
                      <Alert
                        variant='primary'
                      >
                        {message.chat_message}
                      </Alert>
                    </div>
                  )
              }
            </React.Fragment>
            )
          }
        </div>
        <InputGroup>
          <Form.Control
            className='chat-message-input'
            as='textarea'
            placeholder='Type a message...'
            value={message}
            onChange={(event) => {
              this.setState({ message: event.target.value });
            }}
          />
          <InputGroup.Append>
            <Button onClick={this.onSendMessage} >Send</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }
}

export default Chat;