INSERT INTO notifications (user_id, notification)
  VALUES ($1, $2)
RETURNING
  id;

