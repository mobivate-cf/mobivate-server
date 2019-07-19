'use strict';

const supertest = require('supertest');

const passport = require('../src/app').passport;
const server = require('../src/app').server;

describe('App', () => {
  it('has a /dashboard GET route', () => {
    supertest(server)
      .get('/dashboard')
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.text).toBe('Logged in!')
      })
      .catch(console.error);
  });
  it('has a /logout GET route', () => {
    supertest(server)
      .get('/logout')
      .then(response => {
        expect(response.status).not.toContain(4);
        expect(response.status).not.toContain(5);
      })
      .catch(console.error);
  });

  it('returns json on /test route', () => {
    supertest(server)
      .get('/test')
      .then(response => {
        console.log(response.text)
        expect(typeof response.text).toBe('string');
      })
      .catch(console.error)
  });

  it('calling /login/twitter route activates passport middleware', () => {
    const spy = jest.spyOn(passport, 'authenticate');
    supertest(server)
      .get('/oauth/callback')
      .then(() => {
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      })
      .catch(() => {
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
      })
  });

});