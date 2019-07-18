'use strict';

const sql = require('../../src/sql/sql');

describe('SQL Commands', () => {
  it('exports an object', () => {
    expect(typeof sql).toBe('object');
  });
  it('all values are strings of SQL', () => {
    for(const value in sql) {
      expect(typeof value).toBe('string');
    };
  });
});