const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema(
  {
    firtsName: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: [String],
      index: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Person', PersonSchema);
