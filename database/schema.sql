DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  display_name VARCHAR(255),
  user_handle VARCHAR(255),
  auth VARCHAR(255) ARRAY[3]
);

CREATE TABLE goals(
  goal_id SERIAL PRIMARY KEY,
  goal_user_id INTEGER NOT NULL,
  goal_name VARCHAR(255),
  goal_start BIGINT,
  goal_end BIGINT,
  frequency VARCHAR(255),
  FOREIGN KEY(goal_user_id) REFERENCES users(user_id)
);

CREATE TABLE progress(
  progress_id SERIAL PRIMARY KEY,
  progress_user_id INTEGER NOT NULL,
  progress_goal_id INTEGER NOT NULL,
  streak VARCHAR(255),
  num_of_completed_goals SMALLINT,
  num_of_total_goals SMALLINT,
  next_due_date BIGINT,
  FOREIGN KEY(progress_user_id) REFERENCES users(user_id),
  FOREIGN KEY(progress_goal_id) REFERENCES goals(goal_id)
);