'use strict';

const express = rquire('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandlers = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = rquire('./auth/routes.js');

const app = express();

// APP LEVEL MIDDLEWARE
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use(authRoutes);

// CATCH-ALLS
app.use(notFound);
app.use(errorHandlers);

module.exports = {
  server: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  },
};