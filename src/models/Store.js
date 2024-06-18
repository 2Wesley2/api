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
  people: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    index: true
  }]
}, { timestamps: true });

StoreSchema.index({ name: 1, address: 1 });

module.exports = mongoose.model('Store', StoreSchema);