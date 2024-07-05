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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('RolePermission', RolePermissionSchema);
