SELECT id, user_id_1, user_id_2 FROM matches
WHERE user_id_1 = $1
OR user_id_2 = $1;