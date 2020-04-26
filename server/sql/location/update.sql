UPDATE user_location
SET
location = $2
WHERE id = $1;