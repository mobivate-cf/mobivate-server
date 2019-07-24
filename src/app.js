'use strict';

/**
 * @module app
 */

require('dotenv').config();

const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

const oAuthHelpers = require('./oauth-helpers');
const sqlMethods = require('./sql/sql-methods').sqlMethods;

const SESSION_SECRET = process.env.SESSION_SECRET;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Becky & Chris - This is needed for Heroku deployment.
let trustProxy = false;
if (process.env.DYNO) {
  trustProxy = true;
}

/**
 * Creates a new Strategy class which collects the user's Twitter login information for authentication.
 * @param { class } - a new Strategy class
 * @typedef {Object} Strategy
 * @property {string} consumerKey - App key to send to Passport to verify our developer app.
 * @property {string} consumerSecret - App secret to send to Passport to verify our developer app.
 * @property {string} callbackURL - Callback for OAuth.
 * @property {boolean} proxy - Creates a new server to address high volume traffic to app. Required by Passport.
 *
 */
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

/**
 * This is a function for authentication.
 *
 * @param {object} user - Represents the user
 * @param {function} cb - callback function
 */
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

/**
 * This is a function for authentication.
 *
 * @param {object} obj - Represents on object
 * @param {function} cb - callback function
 */
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(express.static('public'));
app.use(require('morgan')('combined'));

app.use(require('body-parser').urlencoded({ extended: true }));

app.use(require('express-session')({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));

app.use(passport.initialize());

/**
 * This is a method used for authentication when the user signs into the app.
 *
 * @param {string} '/login/twitter' - This is a route for authenticating user.
 * @param {method} - passport.authenticate('twitter') This is a method call from Passport to authenticate.
 * @param {function} - request, response is an anonymous function.
 */
app.get('/login/twitter', passport.authenticate('twitter'), (request, response) => {
  response.send({ error: 'Error logging into Twitter' });
});

/**
 * This is a method used for authentication when the user signs into the app.
 *
 * @param {string} '/oauth/callback' - This is a route for authenticating user.
 * @param {method} - passport.authenticate('twitter') This is a method call from Passport to authenticate.
 * @param {function} - request, response is an anonymous function.
 */
app.get(
  '/oauth/callback',
  passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
  (request, response) => {
    const savedUserData = oAuthHelpers.buildUserData(request);

    const userDatabaseObject = oAuthHelpers.hashUserData(savedUserData);

    return sqlMethods
      .createUser(userDatabaseObject)
      .then(() => {
        //Becky & Chris - This link will break if not on one line.
        response.redirect(
          `exp://4z-ggk.jagdeepsing.front-end.exp.direct:80/?id=${userDatabaseObject.user_id}&display_name=${
            userDatabaseObject.display_name
          }&user_name=${userDatabaseObject.user_handle}`
        );
      })
      .catch(console.error);
  }
);

/**
 * This is a route for viewing user goals or the homepage.
 *
 * @param {string} '/dashboard' - This is a route for viewing user goals or the homepage.
 * @param {function} - request, response is an anonymous function that lets the user know when logged in.
 */
app.get('/dashboard', (request, response) => {
  response.send('Logged in!');
});

/** This is a route for creating a user campaign.
 *
 * @param {string} '/createGoal' - This is a route for creating a new campaign.
 * @param {function} - sqlMethods.createGoal - This is a function that fires sql commands to create a campaign in the database.
 */
app.post('/createGoal', sqlMethods.createGoal);

/** This is a route for viewing the user goals at login.
 *
 * @param {string} '/goals' - This is a route for viewing the user goals at login.
 * @param {function} - sqlMethods.getGoals - This is a function that fires sql commands to render the user's current goals.
 */
app.post('/goals', sqlMethods.getGoals);

/** This is a route for updating a user's goal activity.
 *
 * @param {string} '/goals' - This is a route for updating a user's goal activity.
 * @param {function} - sqlMethods.updateGoal - This is a function that fires sql commands to update the user's goal activity record.
 */
app.post('/updateGoal', sqlMethods.updateGoal);

/** This is a route for sign out.
 *
 * @param {string} '/logout' - This is a route for sign out.
 * @param {function} - request, response is an anonymous function that signs the user out.
 */

app.post('/deleteGoal', sqlMethods.deleteGoal);

app.get('/logout', (request, response) => {
  request.session.destroy(() => {
    response.redirect('/');
  });
});

module.exports = {
  passport: passport,
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`)),
};
