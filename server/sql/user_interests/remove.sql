DELETE FROM user_interests
WHERE user_id = $1
AND interest_id = $2;