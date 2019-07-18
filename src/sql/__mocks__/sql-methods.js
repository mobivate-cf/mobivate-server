'use strict';

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

const database = {};

database.query = (sql, param) => {
  return new Promise((resolve, reject) => {
    resolve(
      {
        rows: [ { test: 'test' } ] 
      } 
    );
  })
}

database.connect = () => {};
database.on = () => {};

module.exports = database;