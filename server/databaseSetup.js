const pgp = require('pg-promise')();
const QueryFile = require('pg-promise').QueryFile;
const path = require('path');

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD
} = process.env;

const connection = {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD
}

const db = pgp(connection);

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

  console.log('Creating functions...');
  try {
    await db.none(sql('./sql/init/functions.sql'));
  } catch (e) {
    console.log('Error creating functions: ' + e.message || e);
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
    selectEmail: sql('./sql/users/selectEmail.sql'),
    selectOnUsername: sql('./sql/users/selectOnUsername.sql'),
    selectOnEmail: sql('./sql/users/selectOnEmail.sql'),
    selectPassword: sql('./sql/users/selectPassword.sql'),
    getVerificationStatus: sql('./sql/users/getVerificationStatus.sql'),
    update: sql('./sql/users/update.sql'),
    updateEmail: sql('./sql/users/updateEmail.sql'),
    updatePassword: sql('./sql/users/updatePassword.sql'),
    updateRating: sql('./sql/users/updateRating.sql'),
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
    verify: sql('./sql/users/verify.sql'),
    geographicDistance: sql('./sql/users/geographicDistance.sql')
  },
  dbUserProfiles: {
    create: sql('./sql/user_profiles/create.sql'),
    select: sql('./sql/user_profiles/select.sql'),
    update: sql('./sql/user_profiles/update.sql')
  },
  dbLikes: {
    create: sql('./sql/likes/create.sql'),
    select: sql('./sql/likes/select.sql'),
    selectCountOnLiked: sql('./sql/likes/selectCountOnLiked.sql'),
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
    selectFromUsers: sql('./sql/blocked/selectFromUsers.sql'),
    create: sql('./sql/blocked/create.sql'),
    remove: sql('./sql/blocked/remove.sql')
  },
  dbReported: {
    select: sql('./sql/reported/select.sql'),
    selectFromUsers: sql('./sql/reported/selectFromUsers.sql'),
    create: sql('./sql/reported/create.sql')
  },
  dbGenders: {
    selectAll: sql('./sql/genders/selectAll.sql')
  },
  dbSexualities: {
    selectAll: sql('./sql/sexualities/selectAll.sql')
  },
  dbInterests: {
    select: sql('./sql/interests/select.sql')
  },
  dbUserInterests: {
    select: sql('./sql/user_interests/select.sql'),
    create: sql('./sql/user_interests/create.sql'),
    remove: sql('./sql/user_interests/remove.sql')
  },
  dbImages: {
    create: sql('./sql/images/create.sql'),
    select: sql('./sql/images/select.sql'),
    selectAll: sql('./sql/images/selectAll.sql'),
    selectFirst: sql('./sql/images/selectFirst.sql'),
    selectCount: sql('./sql/images/selectCount.sql'),
    remove: sql('./sql/images/remove.sql')
  },
  dbTokens: {
    create: sql('./sql/tokens/create.sql'),
    select: sql('./sql/tokens/select.sql'),
    remove: sql('./sql/tokens/remove.sql')
  },
  dbNotifications: {
    create: sql('./sql/notifications/create.sql'),
    select: sql('./sql/notifications/select.sql'),
    remove: sql('./sql/notifications/remove.sql')
  },
  dbViews: {
    create: sql('./sql/views/create.sql'),
    selectOnUsers: sql('./sql/views/selectOnUsers.sql'),
    selectOnViewed: sql('./sq/views/selectOnViewed.sql'),
    selectCountOnViewed: sql('./sql/views/selectCountOnViewed.sql')
  },
  dbLocation: {
    create: sql('./sql/location/create.sql'),
    update: sql('./sql/location/update.sql'),
    check: sql('./sql/location/check.sql'),
    createOrUpdate: sql('./sql/location/createOrUpdate.sql')
  }
};