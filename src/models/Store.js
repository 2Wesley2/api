const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  address: {
    type: String,
    required: true,
    index: true

  },
  contact: {
    type: String,
    required: true,
    index: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', StoreSchema);