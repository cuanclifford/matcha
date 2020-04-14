CREATE TABLE IF NOT EXISTS users (
  id serial NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  username varchar(25) NOT NULL UNIQUE,
  email varchar(255) NOT NULL UNIQUE,
  hashed_password varchar(256) NOT NULL,
  verified boolean NOT NULL DEFAULT FALSE,
  date_created date DEFAULT CURRENT_DATE,
  rating DECIMAL NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS token (
  id uuid DEFAULT uuid_generate_v4 () NOT NULL,
  email varchar(255) NOT NULL,
  date_created timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS blocked (
  user_id_blocked int NOT NULL,
  user_id_blocker int NOT NULL,
  FOREIGN KEY (user_id_blocked) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_blocker) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reported (
  user_id_reported int NOT NULL,
  user_id_reporter int NOT NULL,
  FOREIGN KEY (user_id_reported) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_reporter) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
  user_id_liker int NOT NULL,
  user_id_liked int NOT NULL,
  FOREIGN KEY (user_id_liker) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_liked) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id_liker, user_id_liked)
);

CREATE TABLE IF NOT EXISTS views (
  user_id_viewed int NOT NULL,
  user_id_viewer int NOT NULL,
  FOREIGN KEY (user_id_viewed) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_viewer) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id_viewed, user_id_viewer)
);

CREATE TABLE IF NOT EXISTS images (
  id serial NOT NULL,
  user_id int NOT NULL,
  image_path varchar(100) NOT NULL,
  mime_type varchar(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS interests (
  id serial NOT NULL,
  interest varchar(100) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_interests (
  user_id int NOT NULL,
  interest_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (interest_id) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id serial NOT NULL,
  user_id_1 int NOT NULL,
  user_id_2 int NOT NULL,
  FOREIGN KEY (user_id_1) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id_2) REFERENCES users (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id serial NOT NULL,
  user_id int NOT NULL,
  match_id int NOT NULL,
  chat_message varchar(1000) NOT NULL,
  date_created timestamp DEFAULT CURRENT_DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (match_id) REFERENCES matches (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS genders (
  id serial NOT NULL,
  gender varchar(16) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sexualities (
  id serial NOT NULL,
  sexuality varchar(16) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_profiles (
  user_id int NOT NULL UNIQUE,
  gender_id int NOT NULL,
  sexuality_id int NOT NULL,
  biography varchar(400),
  birthdate date NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (gender_id) REFERENCES genders (id) ON DELETE CASCADE,
  FOREIGN KEY (sexuality_id) REFERENCES sexualities (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_location (
  user_id int NOT NULL UNIQUE,
  location POINT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id serial NOT NULL,
  user_id int NOT NULL,
  notification varchar(512) NOT NULL,
  date_created timestamp DEFAULT CURRENT_DATE NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

