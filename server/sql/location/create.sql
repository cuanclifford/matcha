INSERT INTO user_location (user_id, location)
VALUES ($1, $2)
RETURNING id;