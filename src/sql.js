module.exports = sql = {
  test: `SELECT * FROM users JOIN goals ON (users.user_id = goals.goal_user_id) JOIN progress ON (users.user_id = progress.progress_user_id)`,
  createGoal: `INSERT INTO goals (goal_user_id, goal_name, goal_start, goal_end, frequency) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
  createProgress: `INSERT INTO progress (progress_user_id, progress_goal_id, streak, num_of_completed_goals, num_of_total_goals, next_due_date) VALUES ($1, $2, 0, 0, 0, 0)`,
}