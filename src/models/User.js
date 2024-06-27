const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true },
    person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      unique: true,
      required: true,
    },
    rolePermission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RolePermission',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
