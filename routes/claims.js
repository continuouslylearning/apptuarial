const express = require('express');
const Claims = require('../models/claim');
const Policies = require('../models/policy');
const { validateId } = require('../validation/id');
const router = express.Router();

router.get('/', (req, res, next) => {
  const userId = req.user.id;

  Claims.find({ userId })
    .then(claims => {
      res.json(claims);
    })
    .catch(next);
});

router.get('/:id', validateId, (req, res, next) => {
  const userId = req.user.id;
  const claimId = req.params.id;

  Claims.findOne({ _id: claimId, userId})
    .then(claim => {
      if(!claim) return next();
      return res.json(claim);
    })
    .catch(next);
});

router.put('/:id', express.json(), validateId, (req, res, next) => {
  const userId = req.user.id;
  const claimId = req.params.id;
  
  if('status' in req.body && (req.body['status'] !== 'OPEN' && req.body['status'] !== 'CLOSED')){
    const err = new Error('Invalid status');
    err.status = 400;
    return next(err);
  }

  const update = {};
  const updateableFields = ['accidentDate', 'transactions', 'status'];

  updateableFields.forEach(field => {
    if(field in req.body){
      update[field] = req.body[field];
    }
  });

  Claims.findOneAndUpdate(
    { _id: claimId, userId}, 
    { $set: update }, 
    { new: true }
  )
    .then(claim => {
      if(!claim) return next();
      return res.status(201).json(claim);
    })
    .catch(next);

});

router.post('/', express.json(),(req, res, next) => {
  const userId = req.user.id;
  const { accidentDate, policyId, caseReserve } = req.body;
  const requiredFields = ['policyId', 'accidentDate', 'caseReserve'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if(missingField){
    const err = new Error(`Missing ${missingField} field`);
    err.status = 400;
    return next(err);
  }

  const transaction = {
    transactionDate: new Date(),
    caseReserve
  };
  const transactions = [transaction];

  const claim = {
    accidentDate, 
    userId, 
    transactions, 
    policyId
  };


  Policies.findOne({ _id: policyId, userId })
    .then(policy => {
      if(!policy){
        const err = new Error('Policy does not exist');
        err.status = 400;
        return Promise.reject(err);
      }
      return Claims.create(claim);
    })
    .then(claim => res.status(201).json(claim))
    .catch(next);
});

router.delete('/:id', validateId, (req, res, next) => {
  const userId = req.user.id;
  const claimId = req.params.id;

  Claims.findOne({ _id: claimId, userId })
    .then(claim => {
      if(!claim) return Promise.reject();
      return claim.remove();
    })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;