const { dbConnect, dbDisconnect } = require('../db-mongoose');
const Users = require('../models/user');
const Policies = require('../models/policy');
const Claims = require('../models/claim');
const users = require('./users');
const policies = require('./policies');
const claims = require('./claims');

dbConnect()
  .then(() => Promise.all([Users.deleteMany(), Policies.deleteMany(), Claims.deleteMany()]))
  .then(() => Promise.all([Users.insertMany(users), Policies.insertMany(policies), Claims.insertMany(claims)]))
  .then(() => dbDisconnect());