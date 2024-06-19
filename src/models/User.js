const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'lojista'],
    default: 'lojista',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);