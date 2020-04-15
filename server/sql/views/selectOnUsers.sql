SELECT
  *
FROM
  views
WHERE
  user_id_viewer = $1
  AND user_id_viewed = $2;

