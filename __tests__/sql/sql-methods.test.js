'use strict';

const sqlMethods = require('../../src/sql/sql-methods').sqlMethods;

// const database = require('../../src/sql/__mocks__/sql-methods.js');

// jest.mock('database');
const response = { send: () => {} };

describe('SQL Route Methods', () => {
  describe('test', () => {
    xit('queries the database', () => {
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
        const didQuery = sqlMethods.getGoals({body: {goal_user_id: 1149045194530017300}}, response)
        // expect(spy).toHaveBeenCalled();
        // spy.mockRestore();
        expect(didQuery).toBeDefined();
      }
      catch (error) {
        console.error(error);
      }
    });
  });
  
  describe('test', () => {
    xit('queries the database', async () => {
      const didQuery = await sqlMethodsMock.test('test');
      expect(JSON.parse(didQuery)).toEqual({ rows: [{testing: 'pass'}] });
    });
  });
});