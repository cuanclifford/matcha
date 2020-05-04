UPDATE users
SET
    first_name = $2,
    last_name = $3,
    username = $4
WHERE id = $1;