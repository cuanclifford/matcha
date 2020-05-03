SELECT * FROM images
WHERE user_id = $1
LIMIT 1;