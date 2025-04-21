CREATE TABLE IF NOT EXISTS profiles
(user_id INTEGER PRIMARY KEY,
 name TEXT,
 bio TEXT,
 age INTEGER,
 gender TEXT,
 photo_id TEXT,
 search_gender TEXT DEFAULT 'all');

CREATE TABLE IF NOT EXISTS matches
(user1_id INTEGER,
 user2_id INTEGER,
 status TEXT,
 PRIMARY KEY (user1_id, user2_id));

CREATE TABLE IF NOT EXISTS messages
(sender_id INTEGER,
 receiver_id INTEGER,
 message TEXT,
 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP); 