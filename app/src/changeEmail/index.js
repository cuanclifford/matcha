import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class ChangeEmail extends React.Component {
    constructor(props) {
        super(props);

        this.state = { email: '' }
    }

    componentDidMount() {
        this.setState({ email: this.props.email });
    }

    onChangeEmail = async () => {
        try {
            const res = await axios.put(
                'http://localhost:3001/email',
                { email: this.state.email }
            );

            if (res.status === 200) {
                this.props.onSetEmail(this.state.email);
                this.props.history.push('/profile');
            }
        } catch (e) { console.log(e.message || e); }
    }

    render() {
        return (
            <div>
                <h1>ChangeEmail Component</h1>
                <label>
                    New Email:
                    <input
                        value={this.state.email}
                        onChange={
                            (event) => {
                                this.setState({ email: event.target.value });
                            }
                        }
                    >
                    </input>
                </label>
                <br />

                <button onClick={this.onChangeEmail} >Submit</button>
            </div>
        );
    }
}

export default withRouter(ChangeEmail);