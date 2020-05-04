DELETE FROM likes
WHERE user_id_liker = $1
AND user_id_liked = $2;