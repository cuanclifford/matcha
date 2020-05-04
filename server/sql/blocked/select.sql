SELECT user_id_blocker, user_id_blocked FROM blocked
WHERE user_id_blocker = $1 AND user_id_blocked = $2;