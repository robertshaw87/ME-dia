USE media_db;

INSERT INTO users (name, password, createdAt, updatedAt) VALUES ("Test User", "password", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

select * from users;