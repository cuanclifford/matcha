const pgp = require('pg-promise')();
const db = pgp('postgres://ccliffor:animetiddies@127.0.0.1:5432/matchaDb');

db.connect();

console.log('intitializing database...');
/*
** Install UUID Extension
*/
db.none("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
  .then(() => { console.log('created matches table') })
  .catch((e) => { 'error installing extension: ' + console.log(e.message || e) });

/*
** User Table
** .----------------------.
** |        User          |
** |----------------------|
** | PK id                |
** | first_name           |
** | last_name            |
** | username             |
** | email                |
** | hashed_password      |
** | date_created         |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"user\" (\n"
  + "id SERIAL PRIMARY KEY,\n"
  + "first_name VARCHAR(255) NOT NULL,\n"
  + "last_name VARCHAR(255) NOT NULL,\n"
  + "username VARCHAR(63) NOT NULL UNIQUE,\n"
  + "email VARCHAR(100) NOT NULL UNIQUE,\n"
  + "hashed_password VARCHAR(512) NOT NULL,\n"
  + "date_created DATE NOT NULL\n"
  + ");"
)
  .then(() => { console.log('created user table') })
  .catch((e) => { console.log('error creating user table: ' + e.message || e) });

/*
** Session Table
** .----------------------.
** |       Session        |
** |----------------------|
** | FK user_id           |
** | logged_in            |
** | verified             |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"session\" (\n"
  + "user_id INT REFERENCES(User.id),\n"
  + "logged_in BOOLEAN NOT NULL,\n"
  + "verified BOOLEAN NOT NULL\n"
  + ");"
)
  .then(() => { console.log('created session table') })
  .catch((e) => { console.log('error creating session table: ' + e.message || e) });

/*
** Tokens Table
** .----------------------.
** |        Tokens        |
** |----------------------|
** | PK id                |
** | FK user_id           |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"tokens\" (\n"
  + "id uuid DEFAULT uuid_generate_v4(),\n"
  + "user_id INT REFERENCES(User.id)\n"
  + ");"
)
  .then(() => { console.log('created tokens table') })
  .catch((e) => { console.log('error creating tokens table: ' + e.message || e) });

/*
** Blocked Table
** .----------------------.
** |       Blocked        |
** |----------------------|
** | FK user_id_blocked   |
** | FK user_id_blocks    |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"blocked\" ("
  + "user_id_blocked INT REFERENCES(User.id),"
  + "user_id_blocks INT REFERENCES(User.id));"
)
  .then(() => { console.log('created blocked table') })
  .catch((e) => { console.log('error creating blocked table: ' + e.message || e) });

/*
** Likes
** .----------------------.
** |        Likes         |
** |----------------------|
** | FK user_id_liked     |
** | FK user_id_liker     |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"likes\" ("
  + "user_id_liked INT REFERENCES(User.id),"
  + "user_id_liker INT REFERENCES(User.id));"
)
  .then(() => { console.log('created likes table') })
  .catch((e) => { console.log('error creating likes table: ' + e.message || e) });

/*
** Views
** .----------------------.
** |        Views         |
** |----------------------|
** | FK user_id_viewed    |
** | FK user_id_viewer    |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"views\" ("
  + "user_id_viewed INT REFERENCES(User.id),"
  + "user_id_viewed INT REFERENCES(User.id));"
)
  .then(() => { console.log('created matches table') })
  .catch((e) => { console.log('error creating views table: ' + e.message || e) });

/*
** Images
** .----------------------.
** |        Images        |
** |----------------------|
** | FK user_id           |
** | image_data           |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"images\" ("
  + "user_id INT REFERENCES(User.id),"
  + "image_data BYTEA NOT NULL);"
)
  .then(() => { console.log('created images table') })
  .catch((e) => { console.log('error creating images table: ' + e.message || e) });

/*
** Matches
** .----------------------.
** |        Matches       |
** |----------------------|
** | PK id                |
** | FK user_id_1         |
** | FK user_id_2         |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"matches\" ("
  + "id SERIAL PRIMARY KEY,"
  + "user_id_1 INT REFERENCES(User.id),"
  + "user_id_2 INT REFERENCES(User.id));"
)
  .then(() => { console.log('created matches table') })
  .catch((e) => { console.log('error creating matches table: ' + e.message || e) });

/*
** ChatHistory
** .----------------------.
** |     ChatHistory      |
** |----------------------|
** | FK match_id          |
** | chat_line            |
** | date_created         |
** `----------------------'
*/
db.none("CREATE TABLE IF NOT EXISTS \"chat_history\" ("
  + "match_id SERIAL PRIMARY KEY,"
  + "chat_line VARCHAR(255) NOT NULL,"
  + "date_created DATE NOT NULL);"
)
  .then(() => { console.log('created chat history table') })
  .catch((e) => { console.log('error creating chat history table: ' + e.message || e) });

console.log('database created');

console.log('running database test...');
db.none("INSERT INTO User VALUES('Test', 'Testicles', 'ttesticles', 'ttesticles@email.com', 'hashedpassword', '1-Jan-1990');")
  .then(() => { console.log('inserted test user') })
  .catch((e) => { console.log('error inserting test user: ' + e.message || e) });
db.any("SELECT * FROM User WHERE User.username = \"ttesticles\";")
  .then((data) => { console.log('test user is ' + data); })
  .catch((e) => { console.log(' error selecting test user: ' + e.message || e) });
console.log('deleting test user')
db.none("DELETE FROM User WHERE User.username = \"ttesticles\";")
  .then(() => { console.log('deleted test user') })
  .catch((e) => { console.log('error deleting test user: ' + e.message || e) });
console.log('database test complete');


module.exports = { db };