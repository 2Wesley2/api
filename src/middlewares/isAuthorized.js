const User = require('../models/User');
const verifyUserRoleAndPermission = require('../service/verifyUserRoleAndPermission');

const isAuthorized = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { id, role } = req;

      if (!id || !role) {
        return res.status(400).json({ message: 'ID ou Role não fornecido' });
      }

      const pipeline = verifyUserRoleAndPermission(
        id,
        role,
        requiredPermission,
      );

      const result = await User.aggregate(pipeline);

      if (!(result.length > 0 && result[0].matchingDocuments > 0)) {
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }

      next();
    } catch (error) {
      console.error('Erro ao verificar token:', error.message);
    }
  };
};

module.exports = isAuthorized;
