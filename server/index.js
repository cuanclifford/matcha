const express = require('express');
const session = require('express-session');
const cors = require('cors');
const sha256 = require('js-sha256');

// TODO: implement tokenKey
// const { tokenKey } = require('./key');
const {
  db,
  dbUsers,
  dbUserProfiles,
  dbLikes,
  dbMatches,
  dbChatMessages
} = require('./databaseSetup');
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
  httpOnly: true,
  resave: true,
  saveUninitialized: false
}));
app.use(cors(corsOptions));
app.use(express.static(__dirname + '../app/public/index.html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Registration */
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
    var username = await db.any(dbUsers.validate.username, userData.username);

    if (username[0] && username[0].id) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    email = await db.any(dbUsers.validate.email, userData.email);

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

/* Login */
app.post('/login', async (req, res) => {
  const userData = req.body;
  const hashedPassword = sha256(userData.password);

  userData.password = '';

  try {
    const users = await db.any(dbUsers.authenticate,
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

/* Logout */
app.get('/logout', async(req, res) => {
  if (!req.session.userId) {
    res.status(200).send();

    return;
  }

  try {
    req.session.destroy();

    res.status(200).send();
  
    return;
  } catch (e) {
    console.log('Error logging user out: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }
});

/* Authenticate */
app.get('/authenticate', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();
    return;
  } else {
    res.status(200).send();
    return;
  }
});

/* Get User Info */
app.get('/user', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();
    return;
  }

  try {
    let id = req.query.id;

    if (id === undefined) {
      id = req.session.userId;
    }

    const user = await db.one(dbUsers.select, id);

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

/* Update User Info */
app.post('/user', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();
    return;
  }

  userData = req.body;

  // TODO: validation

  try {
    await db.none(
      dbUsers.update,
      [
        userData.firstName,
        userData.lastName,
        userData.username
      ]
    );

    res.status(200).send();
  } catch (e) {
    console.log('Error retrieving user data: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }
});

/* Get Suggested Profiles */
app.get('/suggestions', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  try {
    const profile = await db.oneOrNone(dbUserProfiles.select, req.session.userId);

    if (profile === null) {
      res.status(400).send();

      return;
    }

    try {
      let query = null;

      switch (profile.sexuality_id) {
        case 1:
          query = dbUsers.suggestions.heterosexual;
          break;
        case 2:
          query = dbUsers.suggestions.homosexual;
          break;
        case 3:
          query = dbUsers.suggestions.bisexual;
          break;
        default:
          res.status(400).send()
          return;
      }

      const suggestions = await db.any(
        query,
        [
          req.session.userId,
          profile.gender_id
        ]
      );

      console.log('Suggestions:', suggestions);

      res.status(200).json(suggestions);

      return;
    } catch (e) {
      console.log('Error retrieving user suggestions: ' + e.message || e);
    }
  } catch (e) {
    console.log('Error retrieving user profile: ' + e.message || e);
  }
});

/* User Profile */
app.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  try {
    let id = req.query.id;

    if (id === undefined) {
      id = req.session.userId;
    }

    // TODO: validate user id

    const profile = await db.any(dbUserProfiles.select, id);

    if (profile.length == 0) {
      res.status(400).send();

      return;
    }

    res.status(200).json(profile);

    return;
  } catch (e) {
    console.log('Error retrieving user profile: ' + e.message || e);
  }
});

/* Update Profile */
app.post('/profile', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  
  try {
    const userData = req.body;
    console.log(userData);

    const profile = await db.oneOrNone(dbUserProfiles.select, req.session.userId);

    let query = null;

    if (profile === null) {
      query = dbUserProfiles.create;
    } else {
      query = dbUserProfiles.update;
    }

    await db.none(
      query,
      [
        req.session.userId,
        userData.gender,
        userData.sexuality,
        userData.biography,
        userData.birthdate
      ]
    );

    res.status(200).send();

    return;
  } catch (e) {
    console.log('Error updating user profile: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Like Profile */
app.post('/like', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  // Can't like yourself :(
  if (userData.targetId === req.session.userId) {
    res.status(400).send();

    console.log('cant like yourself');

    return;
  }

  try {
    const like = await db.oneOrNone(
      dbLikes.select,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    // Can't like a user more than once
    if (like !== null) {
      res.status(400).send();

      console.log('cant like a user more than once');

      return;
    }

    await db.none(
      dbLikes.create,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    const liked = await db.oneOrNone(
      dbLikes.select,
      [
        userData.targetId,
        req.session.userId
      ]
    );

    try {
      // Match users if they like eachother
      if (liked !== null) {
        await db.none(
          dbMatches.create,
          [
            req.session.userId,
            userData.targetId
          ]
        );
      }

      res.status(200).send();
    } catch (e) {
      console.log('Error matching users: ' + e.message || e);

      res.status(500).json({
        message: 'Unfortunately we are experiencing technical difficulties right now'
      });

      return;
    }
  } catch (e) {
    console.log('Error liking user: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get Matches */
app.get('/matches', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  try {
    let matches = await db.any(dbMatches.selectFromUser, req.session.userId);

    matches = matches.map((match) => {
      return req.session.userId === match.user_id_1
        ? { matchId: match.id, userId: match.user_id_2 }
        : { matchId: match.id, userId: match.user_id_1 };
    })

    res.status(200).json(matches);

    return;
  } catch (e) {
    console.log('Error getting matches: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Send Message */
app.post('/message', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  try {
    const match = await db.oneOrNone( dbMatches.select, userData.matchId );

    if (match === null) {
      res.status(400).send();

      return;
    }

    if (match.user_id_1 !== req.session.userId && match.user_id_2 !== req.session.userId) {
      res.status(400).send();

      return;
    }

    try {
      await db.none(
        dbChatMessages.create,
        [
          req.session.userId,
          userData.matchId,
          userData.chatMessage
        ]
      );
      
      res.status(200).send();

      return;
    } catch (e) {
      console.log('Error sending message: ' + e.message || e);

      res.status(500).json({
        message: 'Unfortunately we are experiencing technical difficulties right now'
      });
  
      return;
    }
  } catch (e) {
    console.log('Error validating match: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get Messages */
app.post('/messages', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  try {
    const match = await db.oneOrNone(dbMatches.select, userData.matchId);

    if (match === null) {
      res.status(400).send();

      return;
    }

    if (match.user_id_1 !== req.session.userId && match.user_id_2 !== req.session.userId) {
      res.status(400).send();

      return;
    }

    try {
      const messages = await db.any(dbChatMessages.select, userData.matchId);
  
      res.status(200).json(messages);
  
      return;
    } catch (e) {
      console.log('Error retrieving messages: ' + e.message || e);
  
      res.status(500).json({
        message: 'Unfortunately we are experiencing technical difficulties right now'
      });
  
      return;
    }
  } catch (e) {
    console.log('Error validating match: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
  
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});