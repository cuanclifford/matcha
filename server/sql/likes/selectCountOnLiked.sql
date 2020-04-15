SELECT
  COUNT(*)
FROM
  likes
WHERE
  user_id_liked = $1;

