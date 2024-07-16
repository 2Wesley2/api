const RolePermission = require('../models/RolePermission');

const validateRole = async () => {
  const errors = [];
  const retailerRoleId = process.env.ROLE_RETAILER;

  if (!retailerRoleId) {
    errors.push({ msg: 'Role ID not configured', status: 500 });
  } else {
    const retailerRolePermission = await RolePermission.findOne({
      role: retailerRoleId,
    }).lean();
    if (!retailerRolePermission) {
      errors.push({ msg: 'RolePermission not found', status: 404 });
    }
  }

  return errors.filter(Boolean);
};

module.export = validateRole;
