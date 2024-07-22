const UserPermission = require('../../models/UserPermission');
const RolePermission = require('../../models/RolePermission');
const generateHttpError = require('../../utils/generateHttpError');

exports.registerUserPermissions = async (userId, role, session) => {
  try {
    const rolePermissions = await RolePermission.findOne({ role })
      .lean()
      .select('permissions');
    if (!rolePermissions) {
      throw generateHttpError(400, 'Permissões do role não encontradas');
    }

    const permissions = rolePermissions.permissions.map(
      (p) => p.permissionName,
    );

    const newUserPermission = new UserPermission({
      userId: userId,
      permissions: permissions,
    });
    await newUserPermission.save({ session });
  } catch (error) {
    console.error('Erro ao criar permissões do usuário:', error.message);
    throw generateHttpError(500, 'Erro ao criar permissões do usuário', error);
  }
};
