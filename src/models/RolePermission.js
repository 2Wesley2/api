const mongoose = require('mongoose');

const RolePermissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      unique: true,
    },
    permissions: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Permission',
          required: true,
        },
        permissionName: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);
RolePermissionSchema.index({ role: 1, 'permissions._id': 1 }, { unique: true });

module.exports = mongoose.model('RolePermission', RolePermissionSchema);
