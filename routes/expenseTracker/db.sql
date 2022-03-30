
-- @block
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50),
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL,
    authToken TEXT,
    PRIMARY KEY(id)
);
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
--@block
SELECT *
FROM Users;
-- @block
CREATE TABLE expenses (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES Users(id)
);
-- @block
INSERT INTO Expenses (user_id, amount, description, date)
VALUES (1, 10.00, "Rent", "2017-01-01");
-- @block
SELECT *
FROM Expenses;