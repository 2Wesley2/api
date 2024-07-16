const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  { roleName: { type: String, required: true, unique: true } },
  { timestamps: true },
);
RoleSchema.index({ roleName: 1 }, { unique: true });

module.exports = mongoose.model('Role', RoleSchema);
