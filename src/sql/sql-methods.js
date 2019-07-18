'use strict';

const pg = require('pg');
const sql = require('./sql');

const database = new pg.Client(`${process.env.DATABASE_URL}`);
// const database = new pg.Client(`postgresql://postgres@localhost/test`); // for local testing
database.connect();
database.on('error', error => console.log(error));

const DAY_IN_MS = 86400000;
const WEEK_IN_MS = 604800000;

const sqlMethods = {
  
  //Becky & Chris - The paramsArray is needed to pass the values through the SQL commands dynamically. The data comes to us in an object.
  createGoal: (request, response) => {
  const paramsArray = [];
  const paramsObject = request.body;
  
  const startDate = request.body.rows[0].goal_start_date; // This should come from frontend, hardcoded for now

  // Chris - these will be used to compute the number of goals throughout the campaign, not yet implemented.
  // const endDate = request.body.goal_end_date;  
  // const frequency = request.body.goal_frequency;

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
      return database.query(sql.createProgress, idsArray)
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
        console.log({due: result.rows[0].next_due_date, freq: result.rows[0].frequency})
        const previousDueDate = result.rows[0].next_due_date;
        const frequency = result.rows[0].frequency;
        let dueDate;
        if(frequency === 'daily') {
          dueDate = parseInt(previousDueDate) + DAY_IN_MS;
        } else if (frequency === 'weekly') {
          dueDate = parseInt(previousDueDate) + WEEK_IN_MS;
        }
        return database.query(`UPDATE progress SET next_due_date = $1 WHERE (progress.progress_goal_id = $2) RETURNING next_due_date`, [dueDate, goal_id])
      })
      .then(result => {
        console.log({done: result.rows})
        response.send(result.rows[0].next_due_date)
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
