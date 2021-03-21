'use strict';

const base64 = require('base-64');
const users = require('../models/users.js');

module.exports = async (req, res, next) => {
  if (!req.headers.auth) {
    next('Sorry, you are not authorized');
  }

  let basic = req.headers.auth.split(' '). pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await users.authenticateBasic(user, pass);
    next();
  } catch (e) {
    res.status(403).json({
      status: 403,
      message: 'Login does not exist'
    })
  }
}