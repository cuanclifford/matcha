SELECT
  COUNT(*)
FROM
  views
WHERE
  user_id_viewed = $1;

