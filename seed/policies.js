const ObjectId = require('mongoose').Types.ObjectId;

const policies = [
  { _id: ObjectId('5bc4f03654190e1d702ea470'), effectiveDate: new Date(2017, 0, 1), expirationDate: new Date(2018, 0, 1), premium: 5000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea471'), effectiveDate: new Date(2017, 1, 1), expirationDate: new Date(2018, 1, 1), premium: 4000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea472'), effectiveDate: new Date(2016, 0, 1), expirationDate: new Date(2017, 0, 1), premium: 3000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea473'), effectiveDate: new Date(2015, 0, 1), expirationDate: new Date(2016, 0, 1), premium: 2000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea474'), effectiveDate: new Date(2014, 0, 1), expirationDate: new Date(2015, 0, 1), premium: 1500, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea475'), effectiveDate: new Date(2014, 6, 1), expirationDate: new Date(2015, 6, 1), premium: 3500, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea476'), effectiveDate: new Date(2015, 0, 1), expirationDate: new Date(2016, 0, 1), premium: 6000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea477'), effectiveDate: new Date(2016, 0, 1), expirationDate: new Date(2017, 0, 1), premium: 7000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea478'), effectiveDate: new Date(2016, 5, 1), expirationDate: new Date(2017, 5, 1), premium: 5500, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea479'), effectiveDate: new Date(2017, 0, 1), expirationDate: new Date(2017, 9, 1), premium: 4000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')},
  {  _id: ObjectId('5bc4f03654190e1d702ea47a'), effectiveDate: new Date(2018, 0, 1), expirationDate: new Date(2018, 9, 1), premium: 4000, exposures: 1, userId: ObjectId('5bc174e565a2e61e44079101')}
];

module.exports = policies;