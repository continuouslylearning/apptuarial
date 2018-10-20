const ObjectId = require('mongoose').Types.ObjectId;
const users = [
  { username: 'anonymous', password: '$2a$10$4zfK898Opq2cUuIM249VhejQZ01QD.oBRk/AaSpN7rUC/BaaG8FYi', _id: ObjectId('5bc174e565a2e61e44079101')},
  { username: 'user', password: '$2a$10$4zfK898Opq2cUuIM249VhejQZ01QD.oBRk/AaSpN7rUC/BaaG8FYi' },
  { username: 'anotheruser', password: '$2a$10$4zfK898Opq2cUuIM249VhejQZ01QD.oBRk/AaSpN7rUC/BaaG8FYi'}
];

module.exports = users;

