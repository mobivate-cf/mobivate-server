'use strict';

require('dotenv').config();

// const pg = require('pg');
const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

const sqlMethods = require('./sql/sql-methods');
const oAuthHelpers = require('./auth');

const app = express();

// const database = new pg.Client(`${process.env.DATABASE_URL}`);

// database.connect();
// database.on('error', error => console.log(error));

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

app.get(
  '/login/twitter',
  passport.authenticate('twitter'),
  (request, response) => {
  response.send({ eroor: 'Error logging into Twitter' });
});

app.get(
  '/oauth/callback',
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  (request, response) => {

    const savedUserData = oAuthHelpers.buildUserData(request);

    const userDatabaseObject = oAuthHelpers.hashUserData(savedUserData);

    return sqlMethods.createUser(userDatabaseObject)
      .then(() => {
        response.redirect(
          `exp://exp.host/@jagdeepsing_/front-end/?
            id=${userDatabaseObject.user_id}&
            display_name=${userDatabaseObject.display_name}&
            user_name=${userDatabaseObject.user_handle}`
        );
      })
      .catch(console.error);
  }
);

app.get('/dashboard', (request, response) => {
  response.send('Logged in!');
});

app.get('/test', sqlMethods.test);

app.post('/createGoal', sqlMethods.createGoal);

app.get('/logout', (request, response) => {
  request.session.destroy(() => {
    response.redirect('/');
  });
});

module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`)),
};