'use strict';

const sql = require('./sql');

const sqlMethods = {

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
      if(result) {
        newEntry = result.rows[0];
        idsArray = [newEntry.goal_user_id, newEntry.goal_id];
      }
      else {
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
    database.query(sql.createUser, paramsArray)
  },

};

module.exports = sqlMethods;
