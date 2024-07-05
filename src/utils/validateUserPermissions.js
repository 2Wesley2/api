const User = require('../models/User');
const buildAggregationPipeline = require('../service/buildAggregationPipeline');

const validateUserPermissions = async (userId) => {
  const errors = [];
  try {
    const aggregationPipeline = buildAggregationPipeline(userId);
    const userWithPermissions = await User.aggregate(aggregationPipeline);
    if (!userWithPermissions || userWithPermissions.length === 0) {
      errors.push({ msg: 'Usuário não encontrado', status: 404 });
    }
    const permissions = userWithPermissions[0].permissions;
    const hasAdminPermission = permissions.some(
      (permission) => permission.permissionName === 'admin',
    );

    if (!hasAdminPermission) {
      errors.push({ msg: 'Permissão negada', status: 403 });
    }
  } catch (error) {
    console.error('Erro ao verificar papel do usuário:', error.message);
    errors.push({
      msg: 'Erro ao verificar papel do usuário',
      status: 500,
      detail: error.message,
    });
  }
  return errors.filter(Boolean);
};
module.exports = validateUserPermissions;
