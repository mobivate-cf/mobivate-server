DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  user_id TEXT PRIMARY KEY,
  display_name VARCHAR(255),
  user_handle VARCHAR(255),
  auth VARCHAR(255) ARRAY[3]
);

CREATE TABLE goals(
  goal_id SERIAL PRIMARY KEY,
  goal_user_id TEXT NOT NULL,
  goal_name VARCHAR(255),
  goal_start BIGINT,
  goal_end BIGINT,
  frequency VARCHAR(255),
  FOREIGN KEY(goal_user_id) REFERENCES users(user_id)
);

CREATE TABLE progress(
  progress_id SERIAL PRIMARY KEY,
  progress_user_id TEXT NOT NULL,
  progress_goal_id INTEGER NOT NULL,
  streak VARCHAR(255),
  num_of_completed_goals SMALLINT,
  num_of_total_goals SMALLINT,
  next_due_date BIGINT,
  FOREIGN KEY(progress_user_id) REFERENCES users(user_id),
  FOREIGN KEY(progress_goal_id) REFERENCES goals(goal_id)
);

INSERT INTO users VALUES ('fDSbgn34GVr4v5j4nv$g53@gfl6', 'fozzie', 'the real fozzie', ARRAY['e', 'f', 'g']);
INSERT INTO goals VALUES (10, 'fDSbgn34GVr4v5j4nv$g53@gfl6', 'exercise', 1234567890123, 1234567899123, 'weekly');
INSERT INTO progress VALUES (100, 'fDSbgn34GVr4v5j4nv$g53@gfl6', 10, 8, 4, 9, 1234567890122);