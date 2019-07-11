'use strict';

require('dotenv').config();

require('./src/app.js').start(process.env.PORT);