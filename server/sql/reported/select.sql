SELECT
  COUNT(*)
FROM
  reported
WHERE
  user_id_reporter = $1
  AND user_id_reported = $2;

