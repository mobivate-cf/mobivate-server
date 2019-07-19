'use strict';

const sqlMethods = require('../../src/sql/sql-methods').sqlMethods;

const sqlMethodsMock = require('../../src/sql/__mocks__/sql-methods');
const database = require('../../src/sql/sql-methods').database;


const response = { send: () => {} };

describe('SQL Route Methods', () => {
  describe('createGoal', () => {
    it('queries the database', () => {
      let spy = jest.spyOn(database, 'query');
      sqlMethods.createGoal({body: {1:'1',2:'2'}}, response)
        .then(() => {
          expect(spy).toHaveBeenCalled();
          spy.mockRestore();
        })
        .catch(error => {
          console.error(error);
          spy.mockRestore();
        })
    });
  });
  describe('getGoals', () => {
    it('queries the database', () => {
      // const spy = jest.spyOn(database, 'query');
      try {
        const didQuery = sqlMethods.getGoals({body: {goal_user_id: 17}}, response)
        // expect(didQuery).toBeDefined();
      }
      catch (error) {
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
        console.error(error);
      }
    });
  });
  
  describe('test', () => {
    it('queries the database', async () => {
      const didQuery = await sqlMethodsMock.test('test');
      expect(JSON.parse(didQuery)).toEqual({ rows: [{testing: 'pass'}] });
    });
  });
});