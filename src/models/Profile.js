const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true,
    },
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
        index: true,
      },
    ],
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', index: true },
  },
  { timestamps: true },
);

ProfileSchema.index({ user: 1, 'stores._id': 1 }, { unique: true });

module.exports = mongoose.model('Profile', ProfileSchema);
