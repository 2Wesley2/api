const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
      index: true,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Customer', CustomerSchema);
