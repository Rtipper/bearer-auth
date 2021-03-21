'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.APP_SECRET || 'secret';

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { toJSON: { virtuals: true } });

// VIRTUAL FIELD TO SCHEMA, MAKES TOKEN READABLE
users.virtual('token').get(function () {
  let token = {
    username: this.username
  }
  return jwt.sign(token, SECRET, {expiresIn: '30 days'});
});

users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
})

// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username })
  const valid = await bcrypt.compare(password, user.password)
  if (valid) { return user; }
  throw new Error('Invalid User');
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = await jwt.verify(token, process.env.SECRET);
    const user = await this.findOne({ username: parsedToken.username })
    if (user) { return user; }
    throw new Error("User not found");
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = mongoose.model('users', users);