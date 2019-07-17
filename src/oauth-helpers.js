'use strict';

const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const SECRET = process.env.JSONWEBTOKEN_SECRET;
const NUMBER_OF_SALTS = parseInt(process.env.NUMBER_OF_SALTS);

module.exports = {

  buildUserData: (request) => {
    const sessionId = request.sessionID;
    const sessionData = request.sessionStore.sessions[sessionId];
    const oAuthData = JSON.parse(sessionData)['oauth:twitter'];
    
    const userData = request.user._json;
    
    const savedUserData = {
      userId: userData.id,
      userName: userData.name,
      userScreenName: userData.screen_name,
      photoLink: request.user.photos[0].value,
      oAuthToken: request.query.oauth_token,
      oAuthVerifier: request.query.oauth_verifier,
      oAuthTokenSecret: oAuthData.oauth_token_secret,
    };

    return savedUserData;
  },

  hashUserData: (savedUserData) => {
    //Becky & Chris - These are tracked to permit write permissions on user's behalf.
    const authJson = JSON.stringify({
      oAuthToken: savedUserData.oAuthToken,
      oAuthTokenSecret: savedUserData.oAuthTokenSecret
    });

    const encodedAuth = jsonWebToken.sign(authJson, SECRET);

    const userDatabaseObject = {
      user_id: bcrypt.hashSync(savedUserData.userId.toString(), NUMBER_OF_SALTS),
      display_name: savedUserData.userScreenName,
      user_handle: savedUserData.userName,
      auth: encodedAuth
    };

    return userDatabaseObject;
  }

}