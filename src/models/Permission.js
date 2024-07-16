const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema(
  { permissionName: { type: String, required: true, unique: true } },
  { timestamps: true },
);
PermissionSchema.index({ permissionName: 1 }, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema);
