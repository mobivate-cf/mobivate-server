'use strict';

require('dotenv').config();

const pg = require('pg');
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

const sql = require('./sql/sql');
const sqlMethods = require('./sql/sql-methods');

const SECRET = process.env.JSONWEBTOKEN_SECRET;
const SALTS = 12;
const app = express();

const database = new pg.Client(`${process.env.DATABASE_URL}`);

database.connect();
database.on('error', error => console.log(error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let trustProxy = false;
if (process.env.DYNO) {
  trustProxy = true;
}

passport.use(
  new Strategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/oauth/callback',
      proxy: trustProxy,
    },
    function(token, tokenSecret, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(express.static('public'));
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
// app.use(passport.session());

app.get('/login/twitter', passport.authenticate('twitter'), (request, response) => {
  response.send({ hello: 'this is the auth route' });
});

app.get(
  '/oauth/callback',
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  (request, response) => {

    const savedUserData = buildUserData(request);
    console.log({savedUserData});
    // add to database
    const userDatabaseObject = hashUserData(savedUserData);
    
    return sqlMethods.createUser(userDatabaseObject)
      .then(result => {
        response.send(result)
      })
    })
    .catch(console.error);
      
    // send username, displayname and id to frontend

    // response.send(savedUserData);
    // response.redirect(
    //   `exp://exp.host/@melissastock/front-end/?display_name=${savedUserData.userScreenName}&user_name=${
    //     savedUserData.userName
    //   }&id=${savedUserData.userId}`
    // );
  }
);

app.get('/dashboard', (request, response) => {
  response.send('Logged in!');
});

app.get('/test', sqlMethods.test);

app.post('/createGoal', sqlMethods.createGoal);

app.get('/logout', (request, response) => {
  request.session.destroy((err) => {
    response.redirect('/');
  });
});

const buildUserData = (request) => {
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
} 

const hashUserData = (savedUserData) => {
  
  const authJson = JSON.stringify({
    oAuthToken: savedUserData.oAuthToken,
    oAuthTokenSecret: savedUserData.oAuthTokenSecret
  });

  const encodedAuth = jsonWebToken.sign(authJson, SECRET);

  const userDatabaseObject = {
    user_id: '',
    display_name: savedUserData.userScreenName,
    user_handle: savedUserData.userName,
    auth: encodedAuth
  };

  userDatabaseObject[user_id] = bcrypt.hashSync(savedUserData.userId.toString(), SALTS)
  return userDatabaseObject;
}

module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`)),
};
