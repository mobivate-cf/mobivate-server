'use strict';

const sqlMethods = require('../../src/sql/sql-methods').sqlMethods;
const database = require('../../src/sql/sql-methods').database;

const response = { send: () => {} };

describe('SQL Route Methods', () => {
  describe('test', () => {
    it('queries the database', () => {
      const spy = jest.spyOn(database, 'query');
      const didQuery = sqlMethods.createGoal({body: {1:'1',2:'2'}}, response);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
  describe('getGoals', () => {
    it('queries the database', () => {
      const spy = jest.spyOn(database, 'query');
      const didQuery = sqlMethods.getGoals({body: {goal_user_id: 1149045194530017300}}, response);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
    xit('sends a response', () => {
      const spy = jest.spyOn(response, 'send');
      const didQuery = sqlMethods.getGoals({body: {goal_user_id: 1149045194530017300}}, response);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
  describe('test', () => {
    it('queries the database', () => {
      const spy = jest.spyOn(database, 'query');
      const didQuery = sqlMethods.test({}, response);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
    it('returns json', () => {
      expect(typeof sqlMethods.test({}, response)).toBe('string');
    });
  });
});