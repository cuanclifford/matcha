const express = require('express');
const session = require('express-session');
const cors = require('cors');
const sha256 = require('js-sha256');

const { tokenKey } = require('./key');
const { db, dbUsers } = require('./databaseSetup');
const { Validation } = require('./validation/validation');

const app = express();
const port = 3001;

var corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}

app.use(session({
  secret: 'anime tiddies',
  httpOnly: true
}));
app.use(cors(corsOptions));
app.use(express.static(__dirname + '../app/public/index.html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
** Registration
*/
app.post('/registration', async (req, res) => {
  const userData = req.body;

  if (!(Validation.isValidUsername(userData.username)
    && Validation.isValidEmail(userData.email)
    && Validation.isValidPassword(userData.password)
    && Validation.isValidFirstName(userData.firstName)
    && Validation.isValidLastName(userData.lastName))) {

    res.status(400).json({ message: 'Invalid user information' });

    return;
  }

  try {
    var username = await db.any(dbUsers.validateUsername, userData.username);

    if (username[0] && username[0].id) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    email = await db.any(dbUsers.validateEmail, userData.email);

    if (email[0] && email[0].id) {
      res.status(400).json({ message: 'Email address already in use' });

      return;
    }
  } catch (e) {
    console.log('Error getting username and email: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing techincal difficulties right now' });

    return;
  }

  const hashedPassword = sha256(userData.password);

  try {
    const user = await db.one(dbUsers.create,
      [
        userData.firstName,
        userData.lastName,
        userData.username,
        userData.email,
        hashedPassword
      ]
    );

    res.status(201).json({ userId: user.id });

    return;
  } catch (e) {
    console.log('Error registering user: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }
});

/*
** Login
*/
app.post('/login', async (req, res) => {
  if (req.session.userId) {
    req.session.destroy();
  }

  const userData = req.body;
  const hashedPassword = sha256(userData.password);

  userData.password = '';

  try {
    const users = await db.any(dbUsers.authorize,
      [
        userData.username,
        hashedPassword
      ]
    );

    user = users[0];

    if (!user || !user.id) {
      res.status(401).json({ message: 'Invalid credentials' });

      return;
    } else {
      req.session.userId = users[0].id;

      res.status(200).send();

      return;
    }
  } catch (e) {
    console.log('Error logging user in: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }
});

/*
** Logout
*/
app.get('/logout', async(req, res) => {
  if (!req.session.userId) {
    res.status(200).send();

    return;
  }

  req.session.destroy();

  res.status(200).send();

  return;
});

/*
** Get User Info
*/
app.get('/user', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();
    return;
  }

  try {
    const user = await db.one(dbUsers.select, req.session.userId);

    res.status(200).json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    });

    return;
  } catch (e) {
    console.log('Error retrieving user data: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/*
** Update User Info
*/
app.post('/user', async(req, res) => {
  userData = req.body;

  if (!req.userId) {
    res.status(403).send();
    return;
  }

  // TODO: validation

  try {
    await db.none(
      "UPDATE users SET first_name = $1, last_name = $2, username = $3 WHERE username = $3;",
      [
        userData.firstName,
        userData.lastName,
        userData.username
      ]
    );
  } catch (e) {
    console.log('Error retrieving user data: ' + e.message || e);
  }
});

/*
** Session Test
*/
app.get('/session', async(req, res) => {
  console.log(req.session);
  if (req.session.views) {
    req.session.views++;
    res.send("You visited this page " + req.session.views + " time(s)");
  } else {
    req.session.views = 1;
    res.send("Welcome to this page for the first time!");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});