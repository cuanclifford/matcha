SELECT
    user_profiles.gender_id,
    user_profiles.sexuality_id,
    genders.gender,
    sexualities.sexuality,
    user_profiles.biography,
    user_profiles.birthdate
FROM ((user_profiles INNER JOIN genders
    ON user_profiles.gender_id = genders.id)
        INNER JOIN sexualities
            ON user_profiles.sexuality_id = sexualities.id)
WHERE user_profiles.user_id = $1;