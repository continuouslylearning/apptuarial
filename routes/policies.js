const express = require('express');
const router = express.Router();
const Policies = require('../models/policy');
const Claims = require('../models/claim');
const { validateId } = require('../validation/id');

router.get('/', (req, res, next) => {
  const userId = req.user.id;

  Policies.find({ userId })
    .then(policies => res.json(policies))
    .catch(next);
});

router.get('/:id', validateId, (req, res, next) => {
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

router.put('/:id', express.json(), validateId, (req, res, next) => {
  const userId = req.user.id;
  const policyId = req.params.id;

  const updateableFields = ['effectiveDate', 'expirationDate', 'premium', 'exposures'];
  const update = {};
  updateableFields.forEach(field => {
    if(field in req.body) update[field] = req.body[field];
  });

  Policies.findOneAndUpdate ({ _id: policyId, userId }, { $set: update }, { new: true})
    .then(policy => {
      if(!policy) return next();
      return res.status(201).json(policy);
    })
    .catch(next);

});


router.post('/', express.json(),(req, res, next) => {
  const userId = req.user.id;
  const { effectiveDate, expirationDate, premium, exposures } = req.body;

  const requiredFields = ['effectiveDate', 'expirationDate', 'premium'];

  const missingField = requiredFields.find(field => !(field in req.body));
  if(missingField){
    const err = new Error(`${missingField} field is missing`);
    err.status = 400;
    return next(err);
  }

  const minValues = {
    premium: 1,
    exposures: 1
  };

  const smallField = Object.keys(minValues).find(field => field in req.body && req.body[field] < minValues[field]);
  if(smallField){
    const err = new Error(`Field ${smallField} must be at least ${minValues[smallField]}`);
    err.status = 422;
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
    .then(policy => res.status(201).json(policy))
    .catch(next);
});


router.delete('/:id', validateId, (req, res, next) => {
  const userId = req.user.id;
  const policyId = req.params.id;

  Policies.findOne({ _id: policyId, userId })
    .then(policy => {
      if(!policy) return Promise.reject();
      return policy.remove();
    })
    .then(() => {
      return Claims.deleteMany({ userId, policyId });
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;