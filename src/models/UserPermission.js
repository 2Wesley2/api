const mongoose = require('mongoose');

const UserPermissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);

UserPermissionSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('UserPermission', UserPermissionSchema);
