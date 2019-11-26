DELETE FROM matches INNER JOIN chat_messages
WHERE id = $1;