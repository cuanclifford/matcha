SELECT id FROM matches
WHERE 
(
    user_id_1 = $1 AND user_id_2 = $2
)
OR
(
    user_id_1 = $2 AND user_id_2 = $1
);