-- Create users
INSERT INTO users
    (username, first_name, last_name, email, verified, rating, hashed_password)
VALUES
    ('hetmal', 'Hetero', 'Male', 'hetmal@mailinator.com', TRUE, 0.56, '19513fdc9da4fb72a4a05eb66917548d3c90ff94d5419e1f2363eea89dfee1dd'),
    ('hetfem', 'Hetero', 'Female', 'hetfem@mailinator.com', TRUE, 0.77, '19513fdc9da4fb72a4a05eb66917548d3c90ff94d5419e1f2363eea89dfee1dd'),
    ('hommal', 'Homo', 'Male', 'hommal@mailinator.com', TRUE, 0.62, '19513fdc9da4fb72a4a05eb66917548d3c90ff94d5419e1f2363eea89dfee1dd'),
    ('homfem', 'Homo', 'Female', 'homfem@mailinator.com', TRUE, 0.42, '19513fdc9da4fb72a4a05eb66917548d3c90ff94d5419e1f2363eea89dfee1dd'),
    ('bimal', 'Bi', 'Male', 'bimal@mailinator.com', TRUE, 0.87, '19513fdc9da4fb72a4a05eb66917548d3c90ff94d5419e1f2363eea89dfee1dd'),
    ('bifem', 'Bi', 'Female', 'bifem@mailinator.com', TRUE, 0.99, '19513fdc9da4fb72a4a05eb66917548d3c90ff94d5419e1f2363eea89dfee1dd');

-- Create preference data
INSERT INTO genders
    (gender)
VALUES
    ('Male'),
    ('Female');

INSERT INTO sexualities
    (sexuality)
VALUES
    ('Heterosexual'),
    ('Homosexual'),
    ('Bisexual');

-- Give users preferences
INSERT INTO user_profiles
    (user_id, gender_id, sexuality_id, biography, birthdate)
VALUES
    (1, 1, 1, 'I am a heterosexual male', '1993-11-25'),
    (2, 2, 1, 'I am a heterosexual female', '1997-11-25'),
    (3, 1, 2, 'I am a homosexual male', '1999-11-25'),
    (4, 2, 2, 'I am a homosexual female', '1996-11-25'),
    (5, 1, 3, 'I am a bisexual male', '1994-11-25'),
    (6, 2, 3, 'I am a bisexual female', '1994-11-25');

-- Create interests
INSERT INTO interests
    (interest)
VALUES
    ('My Little Pony'),
    ('Sonic Fanfictions'),
    ('Jake Paul'),
    ('Post-modernism');

-- Give users interests
INSERT INTO user_interests
    (user_id, interest_id)
VALUES
    (1, 3),
    (2, 1),
    (3, 1),
    (4, 3),
    (5, 2),
    (6, 4);

INSERT INTO user_location
    (user_id, location)
VALUES
    (1, point(-26.021985, 28.029354)),
    (2, point(-26.247658, 28.052332)),
    (3, point(-25.769345, 28.265277)),
    (4, point(-25.862677, 28.151924)),
    (5, point(-26.116891, 28.056275)),
    (6, point(-33.941145, 18.536162))