const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema(
  { permissionName: { type: String, required: true, unique: true } },
  { timestamps: true },
);

module.exports = mongoose.model('Permission', PermissionSchema);
