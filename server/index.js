const express = require('express');
const cors = require('cors');
const db = require('./databaseSetup');
const app = express();
const port = 3001;

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
  // validate information
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