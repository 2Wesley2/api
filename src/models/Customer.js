const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);
