const express = require('express');
const cors = require('cors');
const sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');
const { db, dbUsers, dbSessions } = require('./databaseSetup');
const { Validation } = require('./validation/validation');

const app = express();
const port = 3001;

var corsOptions = {
  origin: 'http://localhost:3000',
}

app.use(cookieParser('anime tiddies'));
app.use(cors(corsOptions));
app.use(express.static(__dirname + '../public/index.html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
** Registration
*/
app.post('/registration', async (req, res) => {
  const userData = req.body;

  if (!Validation.isValidUsername(userData.username)) {
    res.status(400).send({ message: 'Invalid username' });
    return;
  } else if (!Validation.isValidEmail(userData.email)) {
    res.status(400).send({ message: 'Invalid email address' });
    return;
  } else if (!Validation.isValidPassword(userData.password)) {
    res.status(400).send({ message: 'Invalid password' });
    return;
  } else if (!Validation.isValidFirstName(userData.firstName)) {
    res.status(400).send({ message: 'Invalid first name' });
    return;
  } else if (!Validation.isValidLastName(userData.lastName)) {
    res.status(400).send({ message: 'Invalid last name' });
    return;
  }

  try {
    const data = await db.multi("SELECT id FROM users WHERE username = $1;"
      + "SELECT id FROM users WHERE email = $2;",
      [
        userData.username,
        userData.email
      ]
    );

    if (data[0] && data[0][0]) {
      res.status(400).send({ message: 'Username already exists' });
      return;
    }

    if (data[1] && data[1][0]) {
      res.status(400).send({ message: 'Email address already in use' });
      return;
    }
  } catch (e) {
    console.log('Error getting username and email: ' + e.message || e);
    res.status(500).send('Unfortunately we are experiencing techincal difficulties right now');
  }

  const hashedPassword = sha256(userData.password);

  userData.password = '';

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
    try {
      await db.none(dbSessions.create, user.id);
    } catch (e) {
      console.log('Error creating session: ' + e.message || e);
      res.status(500).send({ message: 'Unfortunately we are experiencing technical difficulties right now' });
      return;
    }
    let options = {
      maxAge: 1000 * 60 * 60 * 24, // 24-hour expiration
      httpOnly: true, // only accessible by server
      signed: true // encrypts cookie data
    }
    res.cookie('auth', user.id, options)
    res.status(201).send({ userId: user.id });
    return;
  } catch (e) {
    console.log('Error registering user: ' + e.message || e);
    res.status(500).send({ message: 'Unfortunately we are experiencing technical difficulties right now' });
    return;
  }
});

app.post('/login', async (req, res) => {
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
      res.status(401).send({ message: 'User does not exist' });
      return;
    } else {
      if (!req.signedCookies.auth) {
        try {
          await db.none(dbSessions.create, user.id);
        } catch (e) {
          console.log('Error creating session: ' + e.message || e);
          res.status(500).send({ message: 'Unfortunately we are experiencing technical difficulties right now' });
          return;
        }
        let options = {
          maxAge: 1000 * 60 * 60 * 24, // 24-hour expiration
          httpOnly: true, // only accessible by server
          signed: true // encrypts cookie data
        }
        res.cookie('auth', user.id, options);
      }
      res.status(200).send({ userId: user.id });
      return;
    }
  } catch (e) {
    res.status(500).send({ message: 'Unfortunately we are experiencing technical difficulties right now' });
    return;
  }
});

app.delete('/logout', async (req, res) => {
  userId = req.signedCookies.auth;
  console.log('Signed Cookies: ', req.signedCookies);
  console.log('User ID: ', userId);

  try {
    await db.none(dbSessions.delete, userId);
    res.clearCookie('auth');
    res.status(204).send();
  } catch (e) {
    res.status(500).send({ message: 'Unfortunately we are experiencing technical difficulties right now' });
    return;
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});