const isValid = require('mongoose').Types.ObjectId.isValid;

function validateId(req, res, next){
  const id = req.params.id;
  if(!isValid(id)){
    const err = new Error('Not a valid id');
    err.status = 400;
    next(err);
  }
  next();
}

module.exports = {
  validateId
};