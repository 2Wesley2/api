const Role = require('../models/Role');
const { checkPermission } = require('../helpers/permissionHelpers');

const checkRoleAndPermission = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'retailer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: 'Função inválida. Apenas admin e retailer são permitidos.',
      });
    }
    const userRole = await Role.findById(role).lean();

    if (!userRole) {
      return res.status(400).json({ message: 'Função inválida' });
    }

    if (userRole.roleName === 'admin') {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: 'Acesso negado. Usuário não autenticado.' });
      }
      const isAdmin = await checkPermission(req.user.id, 'admin');
      if (!isAdmin) {
        return res.status(403).json({
          message: 'Apenas administradores podem criar outros administradores.',
        });
      }
    }
    req.userRole = userRole;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao verificar a função e permissão', error });
  }
};

module.exports = checkRoleAndPermission;
