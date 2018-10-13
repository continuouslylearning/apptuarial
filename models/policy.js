const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  effectiveDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  premium: { type: Number, min: 0, required: true },
  exposures: { type: Number, min: 0, default: 1},
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Users' }
});

policySchema.set('toObject', {
  virtuals: true, 
  versionKey: false,    
  transform: (doc, ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Policy', policySchema);


