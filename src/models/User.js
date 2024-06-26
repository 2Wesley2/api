const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  { timestamps: true },
);
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
module.exports = mongoose.model('User', UserSchema);
