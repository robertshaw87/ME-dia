INSERT INTO users (name, password, createdAt, updatedAt) VALUES
("Test User", "password", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
SELECT * FROM users;


INSERT INTO interests (genre, counts, createdAt, updatedAt, UserID) VALUES
("Drama", 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
("Action", 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
("Horror", 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
("Comedy", 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);
SELECT * FROM interests;