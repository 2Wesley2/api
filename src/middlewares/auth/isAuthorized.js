const checkRequestedPermission = require('../../service/authorization/checkRequestedPermission');
const generateHttpError = require('../../utils/generateHttpError');

const isAuthorized = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const { id, role } = req;

      if (!id || !role) {
        return next(generateHttpError(400, 'ID ou Role não fornecido'));
      }

      const hasPermission = await checkRequestedPermission(
        id,
        role,
        requiredPermission,
      );

      if (!hasPermission) {
        return next(generateHttpError(403, 'Acesso não autorizado'));
      }

      next();
    } catch (error) {
      next(generateHttpError(500, 'Erro interno do servidor', error));
    }
  };
};

module.exports = isAuthorized;
