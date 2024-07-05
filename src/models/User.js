const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true, sparse: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    person: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      required: true,
      ref: 'Person',
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Role',
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('User', UserSchema);
