const User = require('../../models/User');
const checkRequestedPermission = require('../../service/checkRequestedPermission');
const generateHttpError = require('../../utils/generateHttpError');

const isAuthorized = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { id, role } = req;

      if (!id || !role) {
        return res.status(400).json({ message: 'ID ou Role não fornecido' });
      }

      const pipeline = checkRequestedPermission(id, role, requiredPermission);

      const result = await User.aggregate(pipeline);

      if (!(result.length === 1 && result[0].matchingDocuments === 1)) {
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }

      next();
    } catch (error) {
      next(generateHttpError(500, 'Erro interno do servidor', error));
    }
  };
};

module.exports = isAuthorized;
