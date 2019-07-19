const pgp = require('pg-promise')();
const QueryFile = require('pg-promise').QueryFile;
const path = require('path');
const db = pgp('postgres://postgres:postgres@127.0.0.1:5432/matchaDb');

db.connect();

function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, {minify: true});
}

(async function initializeDatabase() {
  console.log('Intitializing database...');

  console.log('Creating extensions...');
  try {
    await db.none(sql('./sql/init/extensions.sql'));
  } catch (e) {
    console.log('Error installing extension: ' + e.message || e);
  }

  console.log('Creating tables...');
  try {
    await db.none(sql('./sql/init/tables.sql'));
  } catch (e) {
    console.log('Error creating user table: ' + e.message || e);
  }

  console.log('Database created\n');
})();

module.exports = {
  db,
  dbUsers: {
    create: sql('./sql/users/create.sql'),
    authorize: sql('./sql/users/authorize.sql'),
    select: sql('./sql/users/select.sql')
  }
};