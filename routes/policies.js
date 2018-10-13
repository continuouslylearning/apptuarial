const express = require('express');
const router = express.Router();
const Policies = require('../models/policy');

router.get('/', (req, res, next) => {

  Policies.find({})
    .then(policies => {
      res.json(policies);
    })
    .catch(next);
});

router.post('/', express.json(),(req, res, next) => {

  const { effectiveDate, expirationDate, premium, exposures, userId } = req.body;
  const policy = {
    effectiveDate: new Date(effectiveDate),
    expirationDate: new Date(expirationDate),
    premium,
    exposures, 
    userId
  };

  Policies.create(policy)
    .then(res => res.json(policy))
    .catch(next);
});

module.exports = router;