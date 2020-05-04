UPDATE user_location
SET
location = $2
WHERE user_id = $1;