'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const errorHandlers = require('./auth/middleware/error-handlers/500.js');
const notFound = require('./auth/middleware/error-handlers/404.js');
const authRoutes = require('./auth/routes.js');

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
  app: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  },
};