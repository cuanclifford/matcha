SELECT user_id, chat_message, date_created FROM chat_messages
WHERE match_id = $1;