UPDATE users
SET verified = TRUE
WHERE id = $1;