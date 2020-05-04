SELECT
  user_id_reporter,
  user_id_reported
FROM
  reported
WHERE (user_id_reporter = $1
  AND user_id_reported = $2)
  OR (user_id_reporter = $2
    AND user_id_reported = $1);

