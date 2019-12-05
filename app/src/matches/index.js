import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Matches extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            matches: [],
        }
    }

    componentDidMount() {
        this.getMatches();
    }

    getMatches = async () => {
        try {
            const res = await axios.get('http://localhost:3001/matches');

            if (res.status === 200) {
                console.log('matches', res.data);
                let matches = res.data;
                for (let match in matches) {
                    let userInfo = await this.getUserInfo(matches[match].userId);
                    let profileInfo = await this.getProfileInfo(matches[match].userId);

                    Object.assign(matches[match], userInfo);
                    Object.assign(matches[match], profileInfo);
                }
                this.setState({ matches: matches });
                console.log(matches);
            }
        } catch (e) { console.log(e.message || e); }
    }

    getUserInfo = async (userId) => {
        try {
            const res = await axios.get('http://localhost:3001/user?id=' + userId);

            if (res.status === 200) {
                return res.data;
            }

            return null;
        } catch (e) { console.log(e.message || e); }
    }

    getProfileInfo = async (userId) => {
        try {
            const res = await axios.get('http://localhost:3001/profile?id=' + userId);

            if (res.status === 200) {
                return res.data;
            }

            return null;
        } catch (e) { console.log(e.message || e); }
    }

    render() {
        const { matches } = this.state;

        return (
            <div>
                <h1>Matches Component</h1>
                {
                    matches.map(match => <div key={match.username}>
                        <span>Username: {match.username}</span>
                        <br />
                        <span>First Name: {match.firstName}</span>
                        <br />
                        <span>Last Name: {match.lastName}</span>
                        <br />
                        <span>Gender: {match.gender}</span>
                        <br />
                        <span>Sexuality: {match.sexuality}</span>
                        <br />
                        <span>Biography: {match.biography}</span>
                        <br />
                        <span>Birthdate: {match.birthdate}</span>
                        <br />
                        <Link to={'/profile/' + match.userId} >
                            <button>View Profile</button>
                        </Link>
                        <br />
                        <Link
                            to={{
                                pathname: '/chat/' + match.matchId,
                                state: { targetUsername: match.username },
                            }}
                        >
                            <button>Chat</button>
                        </Link>
                    </div>
                    )
                }
            </div>
        );
    }
}

export default Matches;