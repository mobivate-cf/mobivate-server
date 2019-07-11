'use strict';

require('dotenv').config();

const express = require('express');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

let trustProxy = false;
if (process.env.DYNO) {
  trustProxy = true;
}

passport.use(new Strategy({
    consumerKey: process.env.TWITTER_ID,
    consumerSecret: process.env.TWITTER_PASS,
    callbackURL: '/oauth/callback',
    proxy: trustProxy
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const app = express();
app.use(express.static('public'))
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (request, response) => {
  response.send('index.html');
});

app.get('/login', (request, response) => {
  response.sendStatus(200);
});

app.get('/login/twitter', passport.authenticate('twitter'));

app.get('/oauth/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (request, response) => {
    response.redirect('mobivate://');
  }
);

app.get('/dashboard', (request, response) => {
  response.send('Logged in!');
});

app.get('/logout', (request, response) => {
  request.session.destroy(err => {
    response.redirect('mobivate://');
  }); 
});

module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`) ),
};