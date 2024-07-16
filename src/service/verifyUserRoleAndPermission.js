const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const verifyUserRoleAndPermission = (id, role, requiredPermission) => {
  if (!isValidObjectId(id) || !isValidObjectId(role)) {
    throw new Error('id ou role ObjectId inválida');
  }

  return [
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
        role: mongoose.Types.ObjectId(role),
      },
    },
    {
      $lookup: {
        from: 'rolepermissions',
        localField: 'role',
        foreignField: '_id',
        as: 'rolePermissions',
      },
    },
    { $unwind: '$rolePermissions' },
    {
      $lookup: {
        from: 'permissions',
        localField: 'rolePermissions.permissions',
        foreignField: '_id',
        as: 'permissions',
      },
    },
    {
      $match: {
        'permissions.permissionName': requiredPermission,
      },
    },
    {
      $count: 'matchingDocuments',
    },
  ];
};

module.exports = verifyUserRoleAndPermission;
