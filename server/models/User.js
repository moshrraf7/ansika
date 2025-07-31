const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, select: false },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, select: false },
  otpExpires: { type: Date, select: false },
  isAdult: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);