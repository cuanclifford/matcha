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
  dbChatMessages,
  dbBlocked,
  dbGenders,
  dbSexualities,
  dbInterests,
  dbUserInterests,
} = require('./databaseSetup');
const { Validation } = require('./validation/validation');

const app = express();
const port = 3001;

var corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
    const user = await db.oneOrNone(dbUsers.authenticate,
      [
        userData.username,
        hashedPassword
      ]
    );

    if (user === null) {
      res.status(401).json({ message: 'Invalid credentials' });

      return;
    } else {
      req.session.userId = user.id;

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
app.get('/logout', async (req, res) => {
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
    res.status(200).send(req.session.userId);

    return;
  }
});

/* Get User Info */
app.get('/user', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();
    return;
  }

  const userId = req.query.userId
    ? req.query.userId
    : req.session.userId;

  try {
    const user = await db.oneOrNone(dbUsers.select, userId);

    if (user === null) {
      res.status(400).send();

      return;
    }

    res.status(200).json({
      userId: userId,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name
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
app.put('/user', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();
    return;
  }

  userData = req.body;

  if (!(Validation.isValidFirstName(userData.firstName)
      && Validation.isValidLastName(userData.lastName)
      && Validation.isValidUsername(userData.username))) {

        res.status(400).send("Invalid user details");

        return;
  }

  try {
    const user = await db.oneOrNone(dbUsers.selectOnUsername, userData.username);

    if (user !== null && user.id !== req.session.userId) {
      res.status(400).send("Username already in use");

      return;
    }
  } catch (e) {
    console.log ('Error validating username: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }

  try {
    await db.none(
      dbUsers.update,
      [
        req.session.userId,
        userData.firstName,
        userData.lastName,
        userData.username,
      ]
    );

    res.status(200).send();

    return;
  } catch (e) {
    console.log('Error updating user data: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }
});

app.get('/email', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  try {
    const email = await db.oneOrNone(dbUsers.selectEmail, req.session.userId);

    res.status(200).json({ email: email.email });

    return;
  } catch (e) {
    console.log('Error retrieving email: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }
});

app.put('/email', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  console.log('userdata', userData);

  try {
    const email = await db.oneOrNone(dbUsers.validate.email, userData.email);

    console.log('response: ', email);

    if (email.count !== '0') {
      res.status(400).send();

      return;
    }
  } catch (e) {
    console.log('Error validating email address: ' + e.message || e);

    res.status(500).json({ message: 'Unfortunately we are experiencing technical difficulties right now' });

    return;
  }

  try {
    await db.none(
      dbUsers.updateEmail,
      [
        req.session.userId,
        userData.email,
      ]
    );

    res.status(200).send();

    return;
  } catch (e) {
    console.log('Error updating email address: ' + e.message || e);

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

      // Remove blocked users or users who have blocked you from results
      for (let suggestion in suggestions) {
        try {
          const blocked = await db.oneOrNone(
            dbBlocked.selectFromUsers,
            [
              suggestions[suggestion].id,
              req.session.userId
            ]
          );

          if (blocked !== null) {
            suggestions.splice(suggestions[suggestion], 1);
          }
        } catch (e) {
          console.log('Error retrieving blocks: ' + e.message || e);

          res.status(500).json({
            message: 'Unfortunately we are experiencing technical difficulties right now'
          });

          return;
        }
      }

      const cleanSuggestions = suggestions.map((suggestion) => {
        const {
          id,
          username,
          first_name,
          last_name,
          gender,
          sexuality
        } = suggestion;

        return {
          userId: id,
          username,
          firstName: first_name,
          lastName: last_name,
          gender,
          sexuality
        }
      });

      res.status(200).json(cleanSuggestions);

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

  const userId = req.query.userId
    ? req.query.userId
    : req.session.userId;

  try {
    const profile = await db.oneOrNone(dbUserProfiles.select, userId);

    if (profile === null) {
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
app.put('/profile', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  // TODO: Birthdate validation method
  // if (!(Validation.isValidBiography(userData.biography)
  //     && Validation.isValidBirthdate(userData.birthdate))) {
  //   res.status(400).send();

  //   return;
  // }

  try {
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
        userData.gender_id,
        userData.sexuality_id,
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

    return;
  }

  try {
    // TODO: check if users are blocked
    const blocked = await db.oneOrNone(
      dbBlocked.selectFromUsers,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    if (blocked !== null) {
      res.status(403).send();

      return;
    }
  } catch (e) {
    console.log('Error checking if users are blocked: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

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

      return;
    }
  } catch (e) {
    console.log('Error checking if user is already liked: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }

  try {
    await db.none(
      dbLikes.create,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    try {
      const liked = await db.oneOrNone(
        dbLikes.select,
        [
          userData.targetId,
          req.session.userId
        ]
      );

      try {
        if (liked !== null) {
          const match = await db.oneOrNone(
            dbMatches.selectFromUsers,
            [
              req.session.userId,
              userData.targetId
            ]
          );

          // Match users if they like eachother and aren't matched
          if (match === null) {
            try {
              await db.none(
                dbMatches.create,
                [
                  req.session.userId,
                  userData.targetId
                ]
              );
            } catch (e) {
              console.log('Error matching users: ' + e.message || e);

              res.status(500).json({
                message: 'Unfortunately we are experiencing technical difficulties right now'
              });

              return;
            }
          }
        }

        res.status(200).send();

        return;
      } catch (e) {
        console.log('Error checking if target is matched: ' + e.message || e);

        res.status(500).json({
          message: 'Unfortunately we are experiencing technical difficulties right now'
        });

        return;
      }
    } catch (e) {
      console.log('Error checking if target is liked: ' + e.message || e);

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

/* Unlike Profile */
app.delete('/like', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  try {
    const userData = req.body;

    await db.none(
      dbLikes.remove,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    const match = await db.oneOrNone(
      dbMatches.selectFromUsers,
      [
        userData.targetId,
        req.session.userId
      ]
    );

    // Unmatch users
    if (match !== null) {
      await db.none(dbMatches.remove, match.id);
    }

    res.status(200).send();

    return;
  } catch (e) {
    console.log('Error unliking users: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get Likes */
app.get('/likes', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  try {
    const like = await db.oneOrNone(
      dbLikes.select,
      [
        req.session.userId,
        req.query.userId
      ]
    );

    if (like !== null) {
      res.status(200).send(like);

      return;
    }

    res.status(400).send();

    return;
  } catch (e) {
    console.log('Error getting likes: ' + e.message || e);

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

/* Get Match */
app.get('/match', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  let userId = req.query.userId;

  try {
    let match = await db.oneOrNone(
      dbMatches.selectFromUsers,
      [
        req.session.userId,
        userId
      ]
    );

    console.log('match', match);

    if (match !== null) {
      res.status(200).json(match);

      return;
    }

    res.status(400).send();

    return;
  } catch (e) {
    console.log('Error getting match: ' + e.message || e);

    res.status(500).send();

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
    const match = await db.oneOrNone(dbMatches.select, userData.matchId);

    if (match === null) {
      res.status(400).send();

      return;
    }

    if (match.user_id_1 !== req.session.userId && match.user_id_2 !== req.session.userId) {
      res.status(400).send();

      return;
    }

  } catch (e) {
    console.log('Error validating match: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

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
});

/* Get Messages */
app.get('/messages', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const matchId = req.query.matchId;

  try {
    const match = await db.oneOrNone(dbMatches.select, matchId);

    if (match === null) {
      res.status(400).send();

      return;
    }

    if (match.user_id_1 !== req.session.userId && match.user_id_2 !== req.session.userId) {
      res.status(400).send();

      return;
    }

  } catch (e) {
    console.log('Error validating match: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }

  try {
    const messages = await db.any(dbChatMessages.select, matchId);

    res.status(200).json(messages);

    return;
  } catch (e) {
    console.log('Error retrieving messages: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get Block */
app.get('/block', async (req, res) => {
  if (!res.session.userId) {
    res.status(403).send();

    return;
  }

  const userId = req.query.userId;

  try {
    const blocked = await db.oneOrNone(
      dbBlocked.selectFromUsers,
      [
        req.session.userId,
        userId
      ]
    );

    res.status(200).json(blocked);

    return;
  } catch (e) {
    console.log('Error getting blocked user: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Block User */
app.post('/block', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  try {
    const match = await db.oneOrNone(
      dbMatches.selectFromUsers,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    // Unmatch users
    if (match !== null) {
      try {
        await db.none(dbMatches.remove, match.id);
      } catch (e) {
        console.log('Error unmatching users: ' + e.message || e);

        res.status(500).json({
          message: 'Unfortunately we are experiencing technical difficulties right now'
        });

        return;
      }
    }

    try {
      const liker = await db.oneOrNone(
        dbLikes.select,
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

      // Unlike users
      if (liker !== null) {
        await db.none(
          dbLikes.remove,
          [
            req.session.userId,
            userData.targetId
          ]
        );
      }

      if (liked !== null) {
        await db.none(
          dbLikes.remove,
          [
            userData.targetId,
            req.session.userId
          ]
        );
      }
    } catch (e) {
      console.log('Error unliking users: ' + e.message || e);

      res.status(500).json({
        message: 'Unfortunately we are experiencing technical difficulties right now'
      });

      return;
    }

    await db.none(
      dbBlocked.create,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    res.status(200).send();

    return;
  } catch (e) {
    console.log('Error blocking user: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Unblock User */
app.post('/unblock', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  try {
    await db.none(
      dbBlocked.remove,
      [
        req.session.userId,
        userData.targetId
      ]
    );

    res.status(200).send();

    return;
  } catch (e) {
    console.log('Failed to unblock user: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get Genders */
app.get('/genders', async (req, res) => {
  try {
    const genders = await db.any(dbGenders.selectAll);

    res.status(200).send(genders);

    return;
  } catch (e) {
    console.log('Error retrieving genders: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get Sexualities */
app.get('/sexualities', async (req, res) => {
  try {
    const sexualities = await db.any(dbSexualities.selectAll);

    res.status(200).send(sexualities);

    return;
  } catch (e) {
    console.log('Error retrieving sexualities: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get Interests */
app.get('/interests', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  try {
    const interests = await db.any(dbInterests.select);

    res.status(200).json(interests);

    return;
  } catch (e) {
    console.log('Error getting interests: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Get User Interests */
app.get('/user-interests', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userId = req.query.userId
    ? req.query.userId
    : req.session.userId;

  try {
    const userInterests = await db.any(dbUserInterests.select, userId);

    res.status(200).json(userInterests);

    return;
  } catch (e) {
    console.log('Error getting user interests: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Add User Interest */
app.post('/user-interest', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  try {
    await db.none(
      dbUserInterests.create,
      [
        req.session.userId,
        userData.interest_id
      ]
    );

    res.status(201).send();

    return;
  } catch (e) {
    console.log('Error adding user interest: ' + e.message || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

/* Remove User Interests */
app.delete('/user-interest', async (req, res) => {
  if (!req.session.userId) {
    res.status(403).send();

    return;
  }

  const userData = req.body;

  try {
    await db.none(
      dbUserInterests.remove,
      [
        req.session.userId,
        userData.interest_id
      ]
    );

    res.status(200).send();

    return;
  } catch (e) {
    console.log('Error removing user interest: ' + e.emessage || e);

    res.status(500).json({
      message: 'Unfortunately we are experiencing technical difficulties right now'
    });

    return;
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});