const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const router = express.Router();
const localAuth = require('../strategies/local');


router.use(express.json());
router.post('/login', localAuth, (req, res, next) => {
  const user = req.user;
  const authToken = jwt.sign({ user }, JWT_SECRET);
  res.json({ authToken });
});

module.exports = router;