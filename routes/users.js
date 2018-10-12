const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.use(express.json());

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  const requiredFields = ['username', 'password'];

  const missingField = requiredFields.find(field => !(field in req.body));
  if(missingField){
    const err = new Error(`Missing ${missingField} field.`);
    err.status = 422;
    return next(err);
  }

  const trimmedFields = ['username', 'password'];
  const nontrimmedField = trimmedFields.find(field => req.body[field].trim() !== req.body[field]);
  if(nontrimmedField){
    const err = new Error(`${nontrimmedField} cannot start or end with whitespace.`);
    err.status = 422;
    return next(err);
  }

  const fieldSizes = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };

  const tooSmallField = Object.keys(fieldSizes).find(
    field => 'min' in fieldSizes[field] && req.body[field].trim() < fieldSizes[field].min
  );
  const tooLargeField = Object.keys(fieldSizes).find(
    field => 'max' in fieldSizes[field] && req.body[field].trim() > fieldSizes[field].max
  );

  if(tooSmallField || tooLargeField){
    const message = tooSmallField 
      ? `${tooSmallField} must be at least ${fieldSizes[tooSmallField].min} characters long.`
      : `${tooLargeField} must be at most ${fieldSizes[tooLargeField].max} characters long`;
    const err = new Error(message);
    err.status = 422;
    return next(err);
  }

  User.findOne({ username })
    .then(user => {
      if(user){
        const err = new Error('Username already exists');
        return Promise.reject(err);
      }
      return User.hashPassword(password);
    })
    .then(digest => {
      return User.create({
        username,
        password: digest
      });
    })
    .then(user => {
      return res.status(201).json(user);
    });
});

module.exports = router;