CREATE TABLE IF NOT EXISTS users (
  id SERIAL NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(25) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(256) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  date_created DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS token (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  user_id INT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blocked (
  user_id_blocked INT NOT NULL,
  user_id_blocker INT NOT NULL,
  FOREIGN KEY (user_id_blocked) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_blocker) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
  user_id_liker INT NOT NULL,
  user_id_liked INT NOT NULL,
  FOREIGN KEY (user_id_liker) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_liked) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id_liker, user_id_liked)
);

CREATE TABLE IF NOT EXISTS views (
  user_id_viewed INT NOT NULL,
  user_id_viewer INT NOT NULL,
  FOREIGN KEY (user_id_viewed) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_viewer) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id_viewed, user_id_viewer)
);

CREATE TABLE IF NOT EXISTS images (
  user_id INT NOT NULL,
  image_data BYTEA NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS interests (
  id SERIAL NOT NULL,
  interest VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_interests (
  user_id INT NOT NULL,
  interest_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (interest_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL NOT NULL,
  user_id_1 INT NOT NULL,
  user_id_2 INT NOT NULL,
  FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL NOT NULL,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  chat_message VARCHAR(1000) NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS genders (
  id SERIAL NOT NULL,
  gender VARCHAR(16) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sexualities (
  id SERIAL NOT NULL,
  sexuality VARCHAR(16) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INT NOT NULL UNIQUE,
  gender_id INT NOT NULL,
  sexuality_id INT NOT NULL,
  biography VARCHAR(400),
  birthdate DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (gender_id) REFERENCES genders(id) ON DELETE CASCADE,
  FOREIGN KEY (sexuality_id) REFERENCES sexualities(id) ON DELETE CASCADE
);