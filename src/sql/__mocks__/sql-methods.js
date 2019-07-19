'use strict';

// const pg = require('pgmock2'),
// pgMock = pg();

// pgMock.add(`SELECT * FROM goals LEFT JOIN progress ON (goals.goal_user_id = progress.progress_user_id) WHERE (goals.goal_user_id = $1)`, ['number'], 
//   {
//     rowCount: 1,
//     rows: [
//       { goal_user_id: 17, name: 'John Smith', position: 'application developer' }
//     ]
//   }
// );

// const database = pgMock.connect();

const sqlMethods = {};
sqlMethods.test = (testing) => {
  return new Promise ((resolve, reject) => {
    if(testing) {
      const result = {};
      result.rows = [{testing: 'pass'}];
      resolve(JSON.stringify(result));
    }
    else {
      reject('rejection test');
    }
  });
}

// const database = {};

// database.query = (sql, param) => {
//   return new Promise((resolve, reject) => {
//     resolve(
//       {
//         rows: [ { test: 'test' } ] 
//       } 
//     );
//   })
// }

// database.connect = () => {};
// database.on = () => {};

module.exports = sqlMethods;