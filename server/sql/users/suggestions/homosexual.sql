SELECT DISTINCT username, first_name, last_name, gender, sexuality
FROM ((user_profiles INNER JOIN genders
ON user_profiles.gender_id = genders.id)
    INNER JOIN sexualities
    ON user_profiles.sexuality_id = sexualities.id)
        INNER JOIN users
        ON users.id = user_profiles.user_id
        AND users.id != $1
        AND genders.id = $2
        AND sexualities.sexuality != 'Heterosexual';