const express = require('express');
const Claims = require('../models/claim');

const router = express.Router();

router.get('/', (req, res, next) => {

  Claims.find({})
    .then(claims => {
      res.json(claims);
    })
    .catch(next);
});

module.exports = router;