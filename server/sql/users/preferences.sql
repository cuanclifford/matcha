SELECT
    user_preferences.gender_id,
    user_preferences.sexuality_id,
    genders.gender,
    sexualities.sexuality
FROM ((user_preferences INNER JOIN genders
    ON user_preferences.gender_id = genders.id)
        INNER JOIN sexualities
            ON user_preferences.sexuality_id = sexualities.id)
WHERE user_id = $1;