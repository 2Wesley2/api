const User = require('../models/User');

const checkPermission = async (userId, permissionName) => {
  const user = await User.findById(userId).populate({
    path: 'role',
    populate: {
      path: 'permissions',
      model: 'Permission',
    },
  });

  if (!user || !user.role || !user.role.permissions) {
    return false;
  }

  const hasPermission = user.role.permissions.some(
    (permission) => permission.name === permissionName,
  );
  return hasPermission;
};

module.exports = {
  checkPermission,
};
