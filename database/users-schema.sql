DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS progress;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  display_name VARCHAR(255),
  user_handle VARCHAR(255),
  auth VARCHAR(255) ARRAY[3]
);

CREATE TABLE goals(
  id SERIAL PRIMARY KEY,
  creator_id INTERGER NOT NULL
  goal_name VARCHAR(255),
  goal_start VARCHAR(255),
  goal_end VARCHAR(255),
  frequency VARCHAR(255),
);

CREATE TABLE progress(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  goal_id INTEGER NOT NULL,
  streak VARCHAR(255),
  num_of_completed_goals VARCHAR(255),
  num_of_total_goals VARCHAR(255),
  next_due_date VARCHAR(255)
);