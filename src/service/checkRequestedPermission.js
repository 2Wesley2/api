const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const generateHttpError = require('../utils/generateHttpErrorr');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const checkRequestedPermission = async (id, role, requiredPermission) => {
  if (!isValidObjectId(id) || !isValidObjectId(role)) {
    console.error('[checkRequestedPermission] id ou role ObjectId inválida');
    throw generateHttpError(400, 'id ou role ObjectId inválida');
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
        from: 'userpermissions',
        localField: '_id',
        foreignField: 'userId',
        as: 'permissions',
      },
    },
    { $unwind: '$permissions' },
    {
      $match: {
        'permissions.permissions': requiredPermission,
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ];

  try {
    const result = await mongoose.connection.db
      .collection('users')
      .aggregate(pipeline)
      .toArray();

    if (result.length > 1) {
      console.error(
        '[checkRequestedPermission] Dados inconsistentes: múltiplos documentos encontrados',
      );
      throw generateHttpError(
        500,
        'Dados inconsistentes: múltiplos documentos encontrados',
      );
    }
    return result.length === 1;
  } catch (error) {
    console.error(
      '[checkRequestedPermission] Erro ao verificar permissões:',
      error,
    );
    throw generateHttpError(500, 'Erro ao verificar permissões');
  }
};
module.exports = checkRequestedPermission;
