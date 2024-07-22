const UserPermission = require('../../models/UserPermission');
const RolePermission = require('../../models/RolePermission');
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');

exports.registerUserPermissions = async (userId, role, session) => {
  validateParams({ userId, role });
  try {
    const rolePermissions = await RolePermission.findOne({ role })
      .session(session)
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
    return newUserPermission;
  } catch (error) {
    console.error('Erro ao criar permissões do usuário:', error.message);
    throw generateHttpError(500, 'Erro ao criar permissões do usuário', error);
  }
};
