const pgp = require('pg-promise')();
const db = pgp('postgres://ccliffor:animetiddies@127.0.0.1:5432/matchaDb');

db.connect();

async function initializeDatabase() {
  console.log('intitializing database...');
  /*
  ** Install UUID Extension
  */
  await db.none("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
    .then(() => { console.log('installed uuid extension') })
    .catch((e) => { console.log('error installing extension: ' + e.message || e); });

  /*
  ** User Table
  ** .----------------------.
  ** |        users         |
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
  await db.none("CREATE TABLE IF NOT EXISTS users ("
    + "id SERIAL PRIMARY KEY,"
    + "first_name VARCHAR(255) NOT NULL,"
    + "last_name VARCHAR(255) NOT NULL,"
    + "username VARCHAR(16) NOT NULL UNIQUE,"
    + "email VARCHAR(100) NOT NULL UNIQUE,"
    + "hashed_password VARCHAR(512) NOT NULL,"
    + "date_created DATE NOT NULL);"
  )
    .then(() => { console.log('created user table'); })
    .catch((e) => { console.log('error creating user table: ' + e.message || e) });

  /*
  ** Session Table
  ** .----------------------.
  ** |       session        |
  ** |----------------------|
  ** | FK user_id           |
  ** | logged_in            |
  ** | verified             |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS session ("
    + "user_id INT REFERENCES users(id),"
    + "logged_in BOOLEAN NOT NULL,"
    + "verified BOOLEAN NOT NULL);"
  )
    .then(() => { console.log('created session table') })
    .catch((e) => { console.log('error creating session table: ' + e.message || e) });

  /*
  ** Tokens Table
  ** .----------------------.
  ** |        tokens        |
  ** |----------------------|
  ** | PK id                |
  ** | FK user_id           |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS tokens ("
    + "id uuid DEFAULT uuid_generate_v4(),"
    + "user_id INT REFERENCES users(id));"
  )
    .then(() => { console.log('created tokens table') })
    .catch((e) => { console.log('error creating tokens table: ' + e.message || e) });

  /*
  ** Blocked Table
  ** .----------------------.
  ** |       blocked        |
  ** |----------------------|
  ** | FK user_id_blocked   |
  ** | FK user_id_blocks    |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS blocked ("
    + "user_id_blocked INT REFERENCES users(id),"
    + "user_id_blocks INT REFERENCES users(id));"
  )
    .then(() => { console.log('created blocked table') })
    .catch((e) => { console.log('error creating blocked table: ' + e.message || e) });

  /*
  ** Likes
  ** .----------------------.
  ** |        likes         |
  ** |----------------------|
  ** | FK user_id_liked     |
  ** | FK user_id_liker     |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS likes ("
    + "user_id_liked INT REFERENCES users(id),"
    + "user_id_liker INT REFERENCES users(id));"
  )
    .then(() => { console.log('created likes table') })
    .catch((e) => { console.log('error creating likes table: ' + e.message || e) });

  /*
  ** Views
  ** .----------------------.
  ** |        views         |
  ** |----------------------|
  ** | FK user_id_viewed    |
  ** | FK user_id_viewer    |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS views ("
    + "user_id_viewed INT REFERENCES users(id),"
    + "user_id_viewer INT REFERENCES users(id));"
  )
    .then(() => { console.log('created matches table') })
    .catch((e) => { console.log('error creating views table: ' + e.message || e) });

  /*
  ** Images
  ** .----------------------.
  ** |        images        |
  ** |----------------------|
  ** | FK user_id           |
  ** | image_data           |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS images ("
    + "user_id INT REFERENCES users(id),"
    + "image_data BYTEA NOT NULL);"
  )
    .then(() => { console.log('created images table') })
    .catch((e) => { console.log('error creating images table: ' + e.message || e) });

  /*
  ** Matches
  ** .----------------------.
  ** |        matches       |
  ** |----------------------|
  ** | PK id                |
  ** | FK user_id_1         |
  ** | FK user_id_2         |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS matches ("
    + "id SERIAL PRIMARY KEY,"
    + "user_id_1 INT REFERENCES users(id),"
    + "user_id_2 INT REFERENCES users(id));"
  )
    .then(() => { console.log('created matches table') })
    .catch((e) => { console.log('error creating matches table: ' + e.message || e) });

  /*
  ** ChatHistory
  ** .----------------------.
  ** |     chat_history     |
  ** |----------------------|
  ** | FK match_id          |
  ** | chat_line            |
  ** | date_created         |
  ** `----------------------'
  */
  await db.none("CREATE TABLE IF NOT EXISTS \"chat_history\" ("
    + "match_id SERIAL PRIMARY KEY,"
    + "chat_line VARCHAR(255) NOT NULL,"
    + "date_created DATE NOT NULL);"
  )
    .then(() => { console.log('created chat history table') })
    .catch((e) => { console.log('error creating chat history table: ' + e.message || e) });

  console.log('database created');
}

async function resetDatabase() {
  console.log('resetting database...');

  await db.none("DROP TABLE IF EXISTS chat_history;")
    .then(() => { console.log('dropped table chat_history') })
    .catch((e) => { console.log('error dropping chat_history table: ' + e.message || e); });

  await db.none("DROP TABLE IF EXISTS matches;")
    .then(() => { console.log('dropped table matches'); })
    .catch((e) => { console.log('error dropping matches table: ' + e.message || e); });

  await db.none("DROP TABLE IF EXISTS images;")
    .then(() => { console.log('dropped table images'); })
    .catch((e) => { console.log('error dropping images table: ' + e.message || e); });

  await db.none("DROP TABLE IF EXISTS views;")
    .then(() => { console.log('dropped views images'); })
    .catch((e) => { console.log('error dropping views table: ' + e.message || e); });

  await db.none("DROP TABLE IF EXISTS likes;")
    .then(() => { console.log('dropped likes images'); })
    .catch((e) => { console.log('error dropping likes table: ' + e.message || e); });

  await db.none("DROP TABLE IF EXISTS blocked;")
    .then(() => { console.log('dropped table blocked'); })
    .catch((e) => { console.log('error dropping blocked table: ' + e.message || e); });

  await db.none("DROP TABLE IF EXISTS session;")
    .then(() => { console.log('dropped table session'); })
    .catch((e) => { console.log('error dropping session table: ' + e.message || e); });

  await db.none("DROP TABLE IF EXISTS users CASCADE;")
    .then(() => { console.log('dropped table users'); })
    .catch((e) => { console.log('error dropping users table: ' + e.message || e); });

  await initializeDatabase();

  console.log('database successfully reset');
}

module.exports = {
  db,
  resetDatabase,
  initializeDatabase,
};