module.exports = sql = {
  test: `SELECT * FROM users JOIN goals ON (users.user_id = goals.goal_user_id) JOIN progress ON (users.user_id = progress.progress_user_id)`,
  createGoal: `INSERT INTO goals (goal_user_id, goal_name, goal_start, goal_end, frequency) VALUES ($1, $2, $3, $4, $5)`,
}