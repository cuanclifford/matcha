SELECT id FROM users
WHERE username = $1
AND hashed_password = $2;