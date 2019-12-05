const pgp = require('pg-promise')();
const QueryFile = require('pg-promise').QueryFile;
const path = require('path');
const db = pgp('postgres://postgres:postgres@127.0.0.1:5432/matcha_db');

db.connect();

function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
}

(async function initializeDatabase() {
  console.log('Intitializing database...');

  console.log('Creating extensions...');
  try {
    await db.none(sql('./sql/init/extensions.sql'));
  } catch (e) {
    console.log('Error installing extensions: ' + e.message || e);
  }

  console.log('Creating tables...');
  try {
    await db.none(sql('./sql/init/tables.sql'));
  } catch (e) {
    console.log('Error creating tables: ' + e.message || e);
  }

  console.log('Populating tables...');
  try {
    await db.none(sql('./sql/init/populate.sql'));
  } catch (e) {
    console.log('Error populating tables: ' + e.message || e);
  }

  console.log('Database created\n');
})();

module.exports = {
  db,
  dbUsers: {
    create: sql('./sql/users/create.sql'),
    authorize: sql('./sql/users/authorize.sql'),
    select: sql('./sql/users/select.sql'),
    selectOnUsername: sql('./sql/users/selectOnUsername.sql'),
    update: sql('./sql/users/update.sql'),
    authenticate: sql('./sql/users/authenticate.sql'),
    validate: {
      username: sql('./sql/users/validate/username.sql'),
      email: sql('./sql/users/validate/email.sql'),
    },
    suggestions: {
      bisexual: sql('./sql/users/suggestions/bisexual.sql'),
      heterosexual: sql('./sql/users/suggestions/heterosexual.sql'),
      homosexual: sql('./sql/users/suggestions/homosexual.sql'),
    },
  },
  dbUserProfiles: {
    create: sql('./sql/user_profiles/create.sql'),
    select: sql('./sql/user_profiles/select.sql'),
    update: sql('./sql/user_profiles/update.sql'),
  },
  dbLikes: {
    create: sql('./sql/likes/create.sql'),
    select: sql('./sql/likes/select.sql'),
    remove: sql('./sql/likes/remove.sql')
  },
  dbMatches: {
    create: sql('./sql/matches/create.sql'),
    select: sql('./sql/matches/select.sql'),
    remove: sql('./sql/matches/remove.sql'),
    selectFromUser: sql('./sql/matches/selectFromUser.sql'),
    selectFromUsers: sql('./sql/matches/selectFromUsers.sql')
  },
  dbChatMessages: {
    create: sql('./sql/chat_messages/create.sql'),
    select: sql('./sql/chat_messages/select.sql')
  },
  dbBlocked: {
    select: sql('./sql/blocked/select.sql'),
    create: sql('./sql/blocked/create.sql'),
    remove: sql('./sql/blocked/remove.sql')
  },
  dbGenders: {
    selectAll: sql('./sql/genders/selectAll.sql')
  },
  dbSexualities: {
    selectAll: sql('./sql/sexualities/selectAll.sql')
  }
};