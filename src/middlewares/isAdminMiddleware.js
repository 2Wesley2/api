const User = require('../../models/User');
const Role = require('../../models/Role');

const isAdminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('rolePermission')
      .lean();
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const role = await Role.findById(user.rolePermission.role).lean();
    if (role.roleName !== 'admin') {
      return res.status(403).json({
        message:
          'Acesso negado. Apenas administradores podem realizar esta ação',
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao verificar papel do usuário',
      error: error.message,
    });
  }
};

module.exports = isAdminMiddleware;
