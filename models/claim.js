const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  accidentDate: { type: Date, required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN'},
  transactions: [{ 
    transactionDate: { type: Date, default: new Date(Date.now()) },
    lossPayment: { type: Number, min: 0, default: 0 },
    caseReserve: { type: Number, min: 0, default: 0 }
  }],
  policyId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Policy'},
  userId: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' }
});

claimSchema.virtual('caseReserve').get(function(){
  return this.transactions.slice().sort((a, b) => b.transactionDate - a.transactionDate)[0].caseReserve;
});

claimSchema.virtual('paidLoss').get(function(){
  return this.transactions.reduce((total, { lossPayment}) => total + lossPayment, 0);
});

claimSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Claim', claimSchema);
