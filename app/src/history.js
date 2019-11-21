import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.listen((location, action) => {
    console.log('[History]', action, location.pathname, location.state);
});

export default history;