const { dbConnect, dbDisconnect } = require('./db-mongoose');
const Policies = require('./models/policy');
const Users = require('./models/user');

dbConnect()
  .then(() => {
    return Users.findOne();
  })
  .then((user) => {
    const userId = user.id;
    return Policies.create({
      expirationDate: new Date(Date.now()),
      effectiveDate: new Date(2017, 11, 1),
      premium: 1000,
      exposures: 1,
      userId: userId
    });
  })
  .then(policy => {
    console.log(policy);
  })
  .then(() => dbDisconnect());