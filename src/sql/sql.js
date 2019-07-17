module.exports = sql = {
  test: `SELECT * FROM users 
    LEFT JOIN progress ON (users.user_id = progress.progress_user_id) 
    LEFT JOIN goals ON (progress.progress_goal_id = goals.goal_id)`,
  createUser: `IF NOT EXISTS(SELECT user_id FROM users WHERE (user_id = $1))
    THEN
    INSERT INTO users 
    (user_id, display_name, user_handle, auth)
    VALUES ($1, $2, $3, $4)`,
  createGoal: `INSERT INTO goals 
    (goal_user_id, goal_name, goal_start, goal_end, frequency) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
  createProgress: `INSERT INTO progress 
    (progress_user_id, progress_goal_id, streak, num_of_completed_goals, num_of_total_goals, next_due_date) 
    VALUES ($1, $2, 0, 0, 0, 0)`,
}