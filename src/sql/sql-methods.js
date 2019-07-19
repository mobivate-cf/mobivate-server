'use strict';

/**
 * @module sql-methods
 */

const pg = require('pg');
const sql = require('./sql');

const database = new pg.Client(`${process.env.DATABASE_URL}`);

database.connect();
database.on('error', (error) => console.log(error));

const DAY_IN_MS = 86400000;
const WEEK_IN_MS = 604800000;

/**
 * This is an object with sql methods.
 *
 * @property {function} createGoal - A function that creates a user goal.
 * @return {function} database.query(sql.createGoal, paramsArray - A function that fires a query to the database.
 *
 * @property {function} createUser - A function that creates a user.
 * @return {function} database.query(sql.createGoal, paramsArray - A function that fires a query to the database.
 *
 * @property {function} getGoal - A function that retrieves current goal data.
 * @return {function} database.query(sql.createGoal, paramsArray - A function that fires a query to the database.
 *
 * @property {function} updateGoal - A function that updates an existing goal.
 * @return {function} database.query(sql.createGoal, paramsArray - A function that fires a query to the database.
 *
 * @property {function} test - A function that tests connection to database.
 * @return {function} database.query(sql.createGoal, paramsArray - A function that fires a query to the database.
 */
const sqlMethods = {
  createGoal: (request, response) => {
    const paramsObject = request.body;

    const startDate = request.body.goal_start_date;

    const paramsArray = [
      request.body.goal_user_id,
      request.body.goal_name,
      request.body.goal_start_date,
      request.body.goal_end_date,
      request.body.frequency,
    ];

    let newEntry;
    let idsArray;
    return database
      .query(sql.createGoal, paramsArray)
      .then((result) => {
        try {
          newEntry = result.rows[0];
          let dueDate;
          if ((result.rows[0].frequency = 'daily')) {
            dueDate = parseInt(startDate) + DAY_IN_MS;
          } else if (result.rows[0].frequency === 'weekly') {
            dueDate = parseInt(startDate) + WEEK_IN_MS;
          }
          idsArray = [newEntry.goal_user_id, newEntry.goal_id, dueDate];
        } catch (error) {
          response.send('Something went wrong.');
        }
      })
      .then(() => {
        return database.query(sql.createProgress, idsArray);
      })
      .then((result) => {
        response.send({ message: 'Goal Created!' });
      })
      .catch(console.error);
  },

  createUser: (userDatabaseObject) => {
    let paramsArray = [];
    Object.keys(userDatabaseObject).forEach((key) => {
      paramsArray.push(userDatabaseObject[key]);
    });
    try {
      return database.query(sql.createUser, paramsArray);
    } catch (error) {
      return 'Error';
    }
  },

  getGoals: (request, response) => {
    const user_id = [request.body.goal_user_id];
    database
      .query(sql.getGoals, user_id)
      .then((result) => {
        response.send(result.rows);
      })
      .catch((error) => {
        response.send('Error');
      });
  },

  updateGoal: (request, response) => {
    const goal_id = request.body.goal_id;
    database
      .query(
        `SELECT next_due_date, frequency FROM progress LEFT JOIN goals ON (goals.goal_id = progress.progress_goal_id) WHERE (progress.progress_goal_id = $1)`,
        [goal_id]
      )
      .then((result) => {
        const previousDueDate = result.rows[0].next_due_date;
        const frequency = result.rows[0].frequency;
        let dueDate;
        if (frequency === 'daily') {
          dueDate = parseInt(previousDueDate) + DAY_IN_MS;
        } else if (frequency === 'weekly') {
          dueDate = parseInt(previousDueDate) + WEEK_IN_MS;
        }
        return database.query(
          `UPDATE progress SET next_due_date = $1 WHERE (progress.progress_goal_id = $2) RETURNING next_due_date`,
          [dueDate, goal_id]
        );
      })
      .then((result) => {
        response.send(result.rows[0].next_due_date);
      })
      .catch(console.error);
  },

  deleteGoal: (request, response) => {
    const paramsArray = [request.body.goal_id];
    database.query(`DELETE FROM progress WHERE (progress.progress_goal_id = $1)`, paramsArray)
    .then (() => {
      return database.query(`DELETE FROM goals WHERE (goals.goal_id = $1)`, paramsArray)
        .then(result => {
          response.send({message: 'Goal Deleted'})
        })
        .catch(error => {
          console.error(error);
          response.send({message: 'Error Deleting Goal'})
        })
    })
    .catch(error => {
      console.error(error);
      response.send({message: 'Error Deleting Goal'})
    });
  },

  test: (request, response) => {
    return database
      .query(sql.test)
      .then((result) => {
        if (result) {
          response.send(result.rows);
        } else {
          response.sendStatus(400);
        }
      })
      .catch((error) => {
        response.send('Error');
      });
  },
};

module.exports = { sqlMethods, database };
