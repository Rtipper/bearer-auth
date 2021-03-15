'use strict';

// START DATABASE SERVER
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// START WEB SERVER
require('./src/server.js').start(process.env.PORT);