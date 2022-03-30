-- @block
INSERT INTO users (
        email,
        username,
        passwordHash,
        passwordSalt,
        authToken
    )
VALUES (
        'admin@admin.com',
        'admin',
        '29c6df4ccaf4c78f71c1c944b1f9616a4bd4ba3f080d33e37a2fdd6c0e166f865a9b4db1b59dd61b9ba6a8ff47ec53705f2d5fb19fd59a8b478c70a7ccd33775',
        '049ea7b19c6f0d4179a7c56cdfa9dd32',
        ''
    );
-- @block
SELECT *
FROM Users;
-- @block
INSERT INTO Expenses (user_id, amount, description, categories, date)
VALUES (
        1,
        10.00,
        "Rent",
        "test, hallo, cringe",
        "2017-01-01"
    );
-- @block
INSERT INTO Expenses (user_id, amount, description, categories, date)
VALUES (
        1,
        10.00,
        "Rent",
        "test, hallo, cringe",
        "2017-01-01"
    );
-- @block
SELECT *
FROM Expenses;