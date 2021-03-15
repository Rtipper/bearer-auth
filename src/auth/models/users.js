'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');

const users = new.mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

// VIRTUAL FIELD TO SCHEMA, MAKES TOKEN READABLE
users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  }
  return jwt.sign(tokenObject)
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = bcrypt.hash(this.password, 10);
  }
});

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
    const parsedToken = jwt.verify(token, process.env.SECRET);
    const user = this.findOne({ username: parsedToken.username })
    if (user) { return user; }
    throw new Error("User not found");
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = mongoose.model('users', users);