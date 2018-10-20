const ObjectId = require('mongoose').Types.ObjectId;

const claims = [
  { accidentDate: new Date(2018, 5), status: 'CLOSED', policyId: ObjectId('5bc4f03654190e1d702ea47a'),
    transactions: [
      { transactionDate: new Date(2018, 6), caseReserve: 2000, lossPayment: 0 }, 
      { transactionDate: new Date(2019, 0), caseReserve: 0, lossPayment: 1200 },
      { transactionDate: new Date(2018, 9), caseReserve: 1200, lossPayment: 800 }
    ], 
    userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea47a'), accidentDate: new Date(2018, 1), status: 'OPEN', transactions: [{ transactionDate: new Date(2018, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea470'), accidentDate: new Date(2017, 3), status: 'OPEN', transactions: [{ transactionDate: new Date(2017, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea472'), accidentDate: new Date(2016, 2), status: 'OPEN', transactions: [{ transactionDate: new Date(2016, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea473'), accidentDate: new Date(2015, 3), status: 'OPEN', transactions: [{ transactionDate: new Date(2015, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea476'), accidentDate: new Date(2015, 0), status: 'OPEN', transactions: [{ transactionDate: new Date(2015, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea477'), accidentDate: new Date(2016, 1), status: 'OPEN', transactions: [{ transactionDate: new Date(2016, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea479'), accidentDate: new Date(2017, 1), status: 'OPEN', transactions: [{ transactionDate: new Date(2017, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea474'), accidentDate: new Date(2014, 5), status: 'OPEN', transactions: [{ transactionDate: new Date(2014, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea474'), accidentDate: new Date(2014, 1), status: 'OPEN', transactions: [{ transactionDate: new Date(2014, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea478'), accidentDate: new Date(2016, 0), status: 'OPEN', transactions: [{ transactionDate: new Date(2016, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea471'), accidentDate: new Date(2017, 0), status: 'OPEN', transactions: [{ transactionDate: new Date(2017, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
  { policyId: ObjectId('5bc4f03654190e1d702ea47a'), accidentDate: new Date(2018, 0), status: 'OPEN', transactions: [{ transactionDate: new Date(2018, 6), caseReserve: 1000, lossPayment: 0}], userId: ObjectId('5bc174e565a2e61e44079101')},
];

module.exports = claims;