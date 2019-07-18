'use strict';

const helpers = require('../src/oauth-helpers');

const request = {
  sessionID: 'sessionId',
  sessionStore: {
    sessions: {
      sessionId: JSON.stringify({
        ['oauth:twitter']: 'oauth'
      })
    }
  },
  user: {
    _json: {
      id: 'id',
      name: 'name',
      screen_name: 'screen_name'
    },
    photos: [{value: 'value'}]
  },
  query: {
    oauth_verifier: 'verifier',
    oauth_token_secret: 'secret'
  },
}

describe('OAuth Helpers', () => {
  describe('hashUserData', () => {
    const userData = {
      oAuthToken: 'token',
      oAuthSecret: 'secret',
      userId: 123123,
      user_handle: 'test'
    }
    it('returns an object', () => {
      expect(typeof helpers.hashUserData(userData)).toBe('object');
    });
  });
  describe('buildUserData', () => {
    it('returns an object', () => {
      expect(typeof helpers.buildUserData(request)).toBe('object');
    });
  });
});