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
    validateUsername: sql('./sql/users/validateUsername.sql'),
    validateEmail: sql('./sql/users/validateEmail.sql'),
    authenticate: sql('./sql/users/authenticate.sql'),
    suggestions: {
      bisexual: sql('./sql/users/suggestions/bisexual.sql'),
      heterosexual: sql('./sql/users/suggestions/heterosexual.sql'),
      homosexual: sql('./sql/users/suggestions/homosexual.sql'),
    },
    preferences: sql('./sql/users/preferences.sql')
  }
};