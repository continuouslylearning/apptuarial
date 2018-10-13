const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  accidentDate: { type: Date, required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN'},
  transactions: [{ 
    transactionDate: { type: Date, default: Date.now()},
    lossPayment: { type: Number, default: 0 },
    caseReserve: { type: Number, default: 0 }
  }],
  policyId: { type: mongoose.SchemaType.ObjectId, required: true, ref: 'Policy'},
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' }
});

claimSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Claim', claimSchema);