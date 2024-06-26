const User = require('../models/User');
const Role = require('../models/Role');

const checkPermission = async (userId, requiredPermission) => {
  try {
    const user = await User.findById(userId).populate('role').lean();
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    const userRole = await Role.findById(user.role).lean();
    if (!userRole.permissions.includes(requiredPermission)) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
};

module.exports = {
  checkPermission,
};
