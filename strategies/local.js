const User = require('../models/user');

module.exports = function localAuth(req, res, next){
  const { username, password } = req.body;
  console.log('localAuth', 'running');
  if(!username || !password){
    const err = new Error('Missing username or password');
    err.status = 422;
    return next(err);
  }

  let user;
  User.findOne({ username })
    .then(_user => {
      user = _user;
      if(!user){
        return Promise.reject();
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if(!isValid){
        const err = new Error('Password is invalid');
        err.status = 400;
        return Promise.reject(err);
      }
      res.user = user;
      return next();
    })
    .catch(next);
};