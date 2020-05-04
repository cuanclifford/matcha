import React from 'react';
import axios from 'axios';
import Title from '../generic/title';
import io from 'socket.io-client';

import './chat.css';

import {
  Alert,
  Button,
  Form,
  InputGroup,
  Badge,
  Card
} from 'react-bootstrap';

const UPSTREAM_URI = `http://localhost:3001`;

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      messagesReversed: [],
      message: '',
      onlineStatus: false
    };
  }


  componentDidMount() {
    const { match: { params } } = this.props;
    this.getMessages();
    this.socket = io.connect(`${UPSTREAM_URI}/chat`);
    this.socket.emit('join', params.matchId);
    this.socket.emit('online-status-send', { room: params.matchId, onlineStatus: true, userId: this.props.userId });
    this.socket.emit('online-status-request', { room: params.matchId });
    this.socket.on('message', (message) => this.newMessageEvent(message));
    this.socket.on('online-status-send', (status) => this.onOnlineStatusEvent(status));
    this.socket.on('online-status-request', this.onStatusRequestEvent);
  }

  componentWillUnmount() {
    const { match: { params } } = this.props;

    this.socket.emit('online-status-send', { room : params.matchId, onlineStatus: false, userId: this.props.userId });
    this.socket.disconnect();
  }

  newMessageEvent = (message) => {
    this.setMessages(
      [...this.state.messages, {
        userId: this.props.userId,
        chat_message: message,
        date_created: Date.now()
      }]
    );
  }

  onStatusRequestEvent = () => {
    const { match: { params } } = this.props;
    this.socket.emit('online-status-send', { room: params.matchId, onlineStatus: true, userId: this.props.userId })
  }

  onOnlineStatusEvent = (onlineStatus) => {
    if (onlineStatus.userId == this.props.userId) {
      return;
    }

    this.setState({
      onlineStatus: onlineStatus.onlineStatus
    });
  }

  setMessages = (messages) => {
    const messagesReversed = Array.from(messages).reverse();
    this.setState({
      messages: messages,
      messagesReversed: messagesReversed
    });
  }

  getMessages = async () => {
    const { match: { params } } = this.props;

    try {
      const res = await axios.get(`${UPSTREAM_URI}/messages?matchId=` + params.matchId);

      if (res.status === 200) {
        this.setMessages(res.data);
      }
    } catch (e) { console.log(e.message || e); }
  }

  onSendMessage = async () => {
    const { match: { params } } = this.props;

    let message = this.state.message.trim();

    if (message) {
      try {
        await axios.post(
          `${UPSTREAM_URI}/message`,
          {
            matchId: params.matchId,
            chatMessage: message,
          }
        );

        this.socket.emit('message', { room: params.matchId, message: message });

        await this.getMessages();
      } catch (e) { console.log(e.message || e); }
    }

    this.setState({ message: '' });
  }

  render() {
    const {
      messagesReversed,
      message,
      onlineStatus
    } = this.state;
    const { targetUsername } = this.props.location.state;

    return (
      <div className='chat-container'>
        <Card className='mb-2'>
          <Card.Header className='flex-spaced-between'>
            <Title title={targetUsername} />
            {
              onlineStatus
                ? (
                  <Badge variant='success'>Online</Badge>
                ) : (
                  <Badge variant='danger'>Offline</Badge>
                )
            }
          </Card.Header>
        </Card>
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