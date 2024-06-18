const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  email: {
    type: String, required: true
  },
  permissions: {
    type: [String],
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema); 