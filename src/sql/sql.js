/**
 * @module sql
 */

/** This is an exported object referencing a function containing sql methods.
 * 
 * @property {query} test - A sql query that tests connection to the database. 
 * @property {query} createUser - A sql query that creates a new user in the database. 
 * @property {query} createGoal - A sql query that creates a new goal in the database. 
 * @property {query} createProgress - A sql query that updates a user's progress.
 * @property {query} getGoals - A sql query that gets the user's current statistics from database.
 */

module.exports = sql = {
  test: `SELECT * FROM users 
    LEFT JOIN progress ON (users.user_id = progress.progress_user_id) 
    LEFT JOIN goals ON (progress.progress_goal_id = goals.goal_id)`,

  createUser: `INSERT INTO users (user_id, display_name, user_handle, auth)
    VALUES ($1, $2, $3, $4)
  ON CONFLICT (user_id) DO UPDATE
    SET auth = $4`,

  createGoal: `INSERT INTO goals 
    (goal_user_id, goal_name, goal_start, goal_end, frequency) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,

  createProgress: `INSERT INTO progress 
    (progress_user_id, progress_goal_id, streak, num_of_completed_goals, num_of_total_goals, next_due_date) 
    VALUES ($1, $2, 0, 0, 0, $3)`,
  
  getGoals: `SELECT * FROM goals LEFT JOIN progress ON (goals.goal_id = progress.progress_goal_id) 
    WHERE (goals.goal_user_id = $1)`,

  updateGoal: `SELECT next_due_date, frequency FROM progress LEFT JOIN goals ON (goals.goal_id = progress.progress_goal_id) WHERE (progress.progress_goal_id = $1)`,

  updateProgress: `UPDATE progress SET next_due_date = $1 WHERE (progress.progress_goal_id = $2) RETURNING next_due_date`,

  deleteProgress: `DELETE FROM progress WHERE (progress.progress_goal_id = $1)`,

  deleteGoal: `DELETE FROM goals WHERE (goals.goal_id = $1)`,
  
}