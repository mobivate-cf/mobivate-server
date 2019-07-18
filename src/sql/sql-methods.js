'use strict';

const pg = require('pg');
const sql = require('./sql');

const database = new pg.Client(`${process.env.DATABASE_URL}`);
// const database = new pg.Client(`postgresql://postgres@localhost/test`); // for local testing
database.connect();
database.on('error', error => console.log(error));


const sqlMethods = {
  
  //Becky & Chris - The paramsArray is needed to pass the values through the SQL commands dynamically. The data comes to us in an object.
  createGoal: (request, response) => {
  const paramsArray = [];
  const paramsObject = request.body;

  Object.keys(paramsObject).forEach(key => {
    paramsArray.push(paramsObject[key]);
  });

  let newEntry;
  let idsArray;
  return database.query(sql.createGoal, paramsArray)
    .then(result => {
      try {
        newEntry = result.rows[0];
        idsArray = [newEntry.goal_user_id, newEntry.goal_id];
      }
      catch (error) {
        response.send('Something went wrong.');
      }
    })
    .then(() => {
      database.query(sql.createProgress, idsArray)
    })
    .then(() => {
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
