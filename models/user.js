const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.statics.hashPassword = password => {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password);
};

userSchema.set('timestamps', true);

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.password;
  }
});

module.exports = mongoose.model('User', userSchema);