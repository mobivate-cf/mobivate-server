'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

const errorHandler = require( './middleware/error.js');
const notFound = require( './middleware/404.js' );

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', getHome)

app.use(notFound);
app.use(errorHandler);

function getHome(request, response, next) {
  response.sendStatus(200);
}

module.exports = {
  server: app,
  start: (port) => app.listen(port, () => console.log(`Server up on port ${port}`) ),
};