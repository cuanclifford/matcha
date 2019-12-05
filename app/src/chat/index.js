import React from 'react';
import axios from 'axios';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      message: ''
    };
  }

  componentDidMount() {
    this.getMessages();
  }

  getMessages = async () => {
    const { match: { params }} = this.props;

    try {
      const res = await axios.get('http://localhost:3001/messages?matchId=' + params.matchId);

      if (res.status === 200) {
        console.log(res);

        this.setState({ messages: res.data });
      }
    } catch (e) { console.log(e.message || e); }
  }

  onSendMessage = async () => {
    const { match: { params }} = this.props;

    try {
      await axios.post(
        'http://localhost:3001/message',
        {
          matchId: params.matchId,
          chatMessage: this.state.message,
        }
      );

      this.setState({ message: '' });
      await this.getMessages();
    } catch (e) { console.log(e.message || e); }
  }

  render() {
    const { messages } = this.state;
    // const { targetUsername } = this.props.location.state;
    console.log(this.props.location.state);

    return (
      <div>
        <h1>Chat Component</h1>
        {
          messages.map((message, index) => <div key={index}>
            <span>
            {
              message.user_id === this.props.userId
              ? "You"
              : "Not You"
            }
            </span>:
            <span>{message.chat_message}</span>
            (<span>{message.date_created}</span>)
          </div>
          )
        }
        <textarea
          value={this.state.message}
          onChange={(event) => {
            this.setState({ message: event.target.value });
          }}
          placeholder="Type a message..."
        ></textarea>
        <br />
        <button onClick={this.onSendMessage} >Send</button>
      </div>
    );
  }
}

export default Chat;