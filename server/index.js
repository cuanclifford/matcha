const express = require('express');
const cors = require('cors');
const { db, initializeDatabase, resetDatabase } = require('./databaseSetup');
const { Validation } = require('./validation/validation');
const app = express();
const port = 3001;

(async function testReset() {
  await initializeDatabase();
})();

var corsOptions = {
  origin: 'http://localhost:3000',
}

app.use(cors(corsOptions));
app.use(express.static(__dirname + '../public/index.html'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('You a lil bitch');
});

app.post('/registration', (req, res) => {
  console.log('registering user...');
  console.log(req.body);
  if (
    !(Validation.isValidUsername(req.body.username)
      || Validation.isValidEmail(req.body.email)
      || Validation.isValidPassword(req.body.password)
      || Validation.isValidFirstName(req.body.firstName)
      || Validation.isValidLastName(req.body.lastName))
  ) {
    res.status(400).send({ success: false });
  }

  // update database
  res.status(200).send({ success: true });
});

app.post('/login', (req, res) => {
  console.log('logging in user...');
  // verify credentials
  res.status(200).send({ success: true });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});