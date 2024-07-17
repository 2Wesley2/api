const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const checkRequestedPermission = (id, role, requiredPermission) => {
  console.log(
    '[checkRequestedPermission] Iniciando função com ID:',
    id,
    'Role:',
    role,
    'Permission:',
    requiredPermission,
  );
  if (!isValidObjectId(id) || !isValidObjectId(role)) {
    console.error('[checkRequestedPermission] id ou role ObjectId inválida');
    throw new Error('id ou role ObjectId inválida');
  }
  const objectIdId = ObjectId.createFromHexString(id);
  const objectIdRole = ObjectId.createFromHexString(role);

  const pipeline = [
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
  console.log(
    '[checkRequestedPermission] Pipeline gerado:',
    JSON.stringify(pipeline, null, 2),
  );
  return pipeline;
};

module.exports = checkRequestedPermission;
