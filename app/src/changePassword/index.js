import React from 'react';
import axios from 'axios';

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPassword: '',
            confirmPassword: '',
        }
    }

    render() {
        const {
            newPassword,
            confirmPassword,
        } = this.state;

        return (
            <div>
                <h1>ChangePassword Component</h1>

                <label>
                    New Password:
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={
                            (event) => {
                                this.setState({ newPassword: event.target.value });
                            }
                        }
                    ></input>
                </label>
            </div>
        );
    }
}

export default ChangePassword;