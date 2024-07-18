const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const checkRequestedPermission = (id, role, requiredPermission) => {
  if (!isValidObjectId(id) || !isValidObjectId(role)) {
    console.error('[checkRequestedPermission] id ou role ObjectId inválida');
    throw new Error('id ou role ObjectId inválida');
  }
  const objectIdId = ObjectId.createFromHexString(id);
  const objectIdRole = ObjectId.createFromHexString(role);

  return [
    {
      $match: {
        _id: objectIdId,
        role: objectIdRole,
      },
    },
    {
      $lookup: {
        from: 'rolepermissions',
        localField: 'role',
        foreignField: 'role',
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
    { $count: 'matchingDocuments' },
  ];
};

module.exports = checkRequestedPermission;
