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
      unique: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  { timestamps: true },
);
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true });
UserSchema.index({ person: 1 }, { unique: true });
module.exports = mongoose.model('User', UserSchema);
