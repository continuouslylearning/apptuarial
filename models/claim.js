const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  accidentDate: { type: Date, required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN'},
  transactions: [{ 
    transactionDate: { type: Date, required: true, default: Date.now()},
    lossPayment: { type: Number, required: true, default: 0 },
    caseReserve: { type: Number, required: true, default: 0 }
  }]
});

claimSchema.set('timestamps', true);

claimSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  }
});

module.exports = mongoose.model('Claim', claimSchema);