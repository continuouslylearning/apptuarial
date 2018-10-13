const User = require('../models/user');

module.exports = function localAuth(req, res, next){
  const { username, password } = req.body;
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
        const err = new Error('Username does not exist');
        err.status = 422;
        return Promise.reject(err);
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if(!isValid){
        const err = new Error('Password is invalid');
        err.status = 400;
        return Promise.reject(err);
      }
      console.log(user);
      req.user = user;
      return next();
    })
    .catch(next);
};