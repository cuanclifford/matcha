INSERT INTO token
  (email)
VALUES
  ($1)
RETURNING id;