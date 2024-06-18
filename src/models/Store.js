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
  customers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    index: true
  }]
}, {
  timestamps: true
});

StoreSchema.index({ name: 1, address: 1 });

module.exports = mongoose.model('Store', StoreSchema);