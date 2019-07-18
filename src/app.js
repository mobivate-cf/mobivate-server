'use strict';

require('dotenv').config();

const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

const oAuthHelpers = require('./oauth-helpers');
const sqlMethods = require('./sql/sql-methods');

const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Becky & Chris - This is needed for Heroku deployment.
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
app.use(require('express-session')({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use(passport.initialize());

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
        //Becky & Chris - This link will break if not on one line.
//         response.redirect(
//           `exp://exp.host/@jagdeepsing_/front-end/?id=${userDatabaseObject.user_id}&display_name=${userDatabaseObject.display_name}&user_name=${userDatabaseObject.user_handle}`
//         );
          response.redirect(
            `exp://74-3er.jagdeepsing.front-end.exp.direct:80/?id=${userDatabaseObject.user_id}&display_name=${userDatabaseObject.display_name}&user_name=${userDatabaseObject.user_handle}`
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

app.post('/goals', sqlMethods.getGoals);

app.get('/logout', (request, response) => {
  request.session.destroy(() => {
    response.redirect('/');
  });
});

module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`)),
};
