INSERT INTO user_location (user_id, location)
VALUES ($1, $2)
ON CONFLICT (user_id)
DO
  UPDATE
  SET location = $2
RETURNING user_id;