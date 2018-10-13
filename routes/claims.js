const express = require('express');
const Claims = require('../models/claim');
const Policies = require('../models/policy');

const router = express.Router();

router.get('/', (req, res, next) => {
  const userId = req.user.id;

  Claims.find({ userId })
    .then(claims => {
      res.json(claims);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const userId = req.user.id;
  const { accidentDate, policyId  } = req.body;
  const claim = {
    accidentDate, 
    policyId,
    userId
  };

  Policies.findOne({ _id: policyId, userId })
    .then(policy => {
      if(!policy){
        const err = new Error('Invalid policy id');
        err.status = 404;
        return Promise.reject(err);
      }
      return Claims.create(claim)
    })
    .then(claim => res.json(claim))
    .catch(next);
});

module.exports = router;