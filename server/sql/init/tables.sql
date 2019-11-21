CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(25) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(256) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  date_created DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS token (
  id uuid DEFAULT uuid_generate_v4(),
  user_id INT REFERENCES users(id),
  date_created TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blocked (
  user_id_blocked INT REFERENCES users(id),
  user_id_blocker INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS likes (
  user_id_liked INT REFERENCES users(id),
  user_id_liker INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS views (
  user_id_viewed INT REFERENCES users(id),
  user_id_viewer INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS images (
  user_id INT REFERENCES users(id),
  image_data BYTEA NOT NULL
);

CREATE TABLE IF NOT EXISTS interests (
  id SERIAL PRIMARY KEY,
  interest VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user_interests (
  user_id INT REFERENCES users(id),
  interest_id INT REFERENCES interests(id)
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  user_id_1 INT REFERENCES users(id),
  user_id_2 INT REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS chat_history (
  match_id INT REFERENCES matches(id),
  chat_line VARCHAR(1000) NOT NULL,
  date_created TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS genders (
  id SERIAL PRIMARY KEY,
  gender VARCHAR(16) UNIQUE
);

CREATE TABLE IF NOT EXISTS sexualities (
  id SERIAL PRIMARY KEY,
  sexuality VARCHAR(16) UNIQUE
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id INT REFERENCES users(id),
  gender_id INT REFERENCES genders(id),
  sexuality_id INT REFERENCES sexualities(id)
);