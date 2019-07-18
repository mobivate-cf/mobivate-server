'use strict';

/**
 * @module sql-methods.js
 */

const pg = require('pg');
const sql = require('./sql');

const database = new pg.Client(`${process.env.DATABASE_URL}`);

database.connect();
database.on('error', error => console.log(error));

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
  const paramsArray = [];
  const paramsObject = request.body;
  
  const startDate = request.body;

  Object.keys(paramsObject).forEach(key => {
    paramsArray.push(paramsObject[key]);
  });

  let newEntry;
  let idsArray;
  return database.query(sql.createGoal, paramsArray)
    .then(result => {
      console.log({createGoalResponse: result.rows, json: JSON.stringify(result.rows)})
      try {
        newEntry = result.rows[0];
        let dueDate;
        if (result.rows[0].frequency = 'daily') {
          dueDate = parseInt(startDate) + DAY_IN_MS;
          console.log({dueDate});
        } else if (result.rows[0].frequency === 'weekly') {
          dueDate = parseInt(startDate) + WEEK_IN_MS;
          console.log({dueDate})
        }
        idsArray = [newEntry.goal_user_id, newEntry.goal_id, dueDate];
        console.log({idsArray})
      }
      catch (error) {
        response.send('Something went wrong.');
      }
    })
    .then(() => {
      database.query(sql.createProgress, idsArray)
    })
    .then((result) => {
      console.log({createProgressResult: result})
      response.send({message: 'Goal Created!'});
    })
    .catch(console.error);
  },

  createUser: (userDatabaseObject) => {
    let paramsArray = [];
    Object.keys(userDatabaseObject).forEach(key => {
      paramsArray.push(userDatabaseObject[key]);
    });
    try {
      return database.query(sql.createUser, paramsArray)
    }
    catch (error) {
      return 'Error';
    }
  },
  
  getGoals: (request, response) => {
    const user_id = [request.body.goal_user_id];
    database.query(sql.getGoals, user_id)
      .then(result => {
        response.send(result.rows);
      })
      .catch(error => {
        response.send('Error');
      });
  },
  
  updateGoal: (request, response) => {
    const goal_id = request.body.goal_id;
    database.query(`SELECT next_due_date, frequency FROM progress LEFT JOIN goals ON (goals.goal_id = progress.progress_goal_id) WHERE (progress.progress_goal_id = $1)`, [goal_id])
      .then(result => {
        console.log({rows: result.rows})
        const previousDueDate = result.rows[0].next_due_date;
        const frequency = result.rows[0].frequency;
        let dueDate;
        if(frequency === 'daily') {
          dueDate = parseInt(previousDueDate) + DAY_IN_MS;
        } else if (frequency === 'weekly') {
          dueDate = parseInt(previousDueDate) + WEEK_IN_MS;
        }
        database.query(`UPDATE progress SET next_due_date = $1 WHERE (progress.progress_goal_id = $2)`, [dueDate, goal_id])
      })
      .then(result => {
        console.log({done: result.rows})
        response.send(result)
      })
      .catch(console.error);
  },

  test: (request, response) => {
    return database.query(sql.test)
      .then(result => {
        if(result) {
          response.send(result.rows);
        }
        else {
          response.sendStatus(400);
        }
      })
      .catch(error => {
        response.send('Error');
      });
  }
};

module.exports = {sqlMethods, database};
