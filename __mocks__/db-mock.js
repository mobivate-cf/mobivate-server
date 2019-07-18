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


module.exports = sqlMethods;