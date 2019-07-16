const sql = {
  test: `SELECT * FROM users JOIN goals ON (users.user_id = goals.goal_user_id) JOIN progress ON (users.user_id = progress.progress_user_id)`
}

export default sql;