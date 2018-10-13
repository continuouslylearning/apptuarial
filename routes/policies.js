const express = require('express');
const router = express.Router();
const Policies = require('../models/policy');

router.get('/', (req, res, next) => {
  const userId = req.user.id;

  Policies.find({ userId })
    .then(policies => {
      return res.json(policies);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const policyId = req.params.id;
  const userId = req.user.id;

  Policies.findOne({ _id: policyId, userId })
    .then(policy => {
      if(!policy){
        return Promise.reject();
      }
      return res.json(policy);
    })
    .catch(next);

});

router.post('/', express.json(),(req, res, next) => {
  const userId = req.user.id;
  const { effectiveDate, expirationDate, premium, exposures } = req.body;

  const requiredFields = ['effectiveDate', 'expirationDate', 'premium', 'exposures'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if(missingField){
    const err = new Error(`${missingField} field is missing`);
    err.status = 400;
    return next(err);
  }

  const policy = {
    effectiveDate: new Date(effectiveDate),
    expirationDate: new Date(expirationDate),
    premium,
    exposures, 
    userId
  };

  Policies.create(policy)
    .then(policy => res.json(policy))
    .catch(next);
});

module.exports = router;