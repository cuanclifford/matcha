UPDATE user_profiles
SET
    gender_id = $2,
    sexuality_id = $3,
    biography = $4,
    birthdate = $5
WHERE user_id = $1;