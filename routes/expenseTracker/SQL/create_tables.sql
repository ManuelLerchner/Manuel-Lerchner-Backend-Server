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
CREATE TABLE expenses (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    categories TEXT,
    date DATE NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES Users(id)
);