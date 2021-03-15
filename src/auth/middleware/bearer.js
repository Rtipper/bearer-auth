'use strict';

const users = require('../models/users.js')

module.exports = async (req, res, next) => {

  try {
    if (!req.headers.authorization) { next('Invalid Login') }

    const toke = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateWithToken(toke);

    req.user = validUser;
    req.token = validUser;

  } catch (e) {
    res.status(403).send('Invalid Login');;
  }
}