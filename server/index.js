const express = require('express');
const cors = require('cors');
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');

const { tokenKey } = require('./key');
const { db, dbUsers } = require('./databaseSetup');
const { Validation } = require('./validation/validation');

const app = express();
const port = 3001;

var corsOptions = {
  origin: 'http://localhost:3000',
}

app.use(cors(corsOptions));
app.use(express.static(__dirname + '../public/index.html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, tokenKey, (e, payload) => {
      if (e)
        console.log('Error verifying JWT: ' + e.message || e);
      else if (payload) {
        // refresh token every hour or if expired
        if (payload.exp < Date.now())
          next();
        if (payload.iat >= Date.now() - 1000 * 60 * 60)
          next();
        var newToken = jwt.sign({
          sub: payload.sub,
          exp: Date.now() + 1000 * 60 * 60 * 24 * 7
        }, tokenKey);
        req.token = newToken;
        req.userId = payload.sub;
      }
      next();
    });
  } catch (e) {
    next();
  }
});

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
    res.status(400).json({ message: 'Invalid last name' });
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
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    if (data[1] && data[1][0]) {
      res.status(400).json({ message: 'Email address already in use' });
      return;
    }
  } catch (e) {
    console.log('Error getting username and email: ' + e.message || e);
    res.status(500).json({ message: 'Unfortunately we are experiencing techincal difficulties right now' });
    return;
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
    res.status(201).json({ userId: user.id });
    return;
  } catch (e) {
    console.log('Error registering user: ' + e.message || e);
    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });
    return;
  }
});

app.post('/login', async (req, res) => {
  if (req.userId) {
    res.status(200).send({ token: req.token });
    return;
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
      res.status(401).json({ message: 'User does not exist' });
      return;
    } else {
      // sign jwt
      var token = jwt.sign(
        {
          sub: user.id,
          exp: Date.now() + 1000 * 60 * 60 * 24 * 7
        }, tokenKey);
      res.status(200).json({ token });
      return;
    }
  } catch (e) {
    console.log('Error logging user in: ' + e.message || e);
    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });
    return;
  }
});

app.get('/user', async (req, res) => {
  if (!req.userId) {
    res.status(403).send();
    return;
  }
  try {
    const user = await db.one(dbUsers.select, req.userId);
    res.status(200).json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      token: req.token
    });
    return;
  } catch (e) {
    console.log('Error retrieving user data: ' + e.message || e);
    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now',
      token: req.token
    });
    return;
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});