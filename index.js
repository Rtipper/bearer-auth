'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const server = require('./src/server.js');
const PORT = process.env.PORT || 3000

// START DATABASE SERVER
const MONGODB_URI = process.env.MONGODB_URI;
const options = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
};

mongoose.connect(MONGODB_URI, options)
  .then(() => {
    server.start(PORT)
  })
  .catch(err => console.error(err.message))