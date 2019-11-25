UPDATE users
SET
    first_name = $1,
    last_name = $2,
    username = $3
WHERE username = $3;