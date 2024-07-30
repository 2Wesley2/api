const checkRequestedPermission = require('../../service/authorization/checkRequestedPermission');
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');
const debug = require('debug')('app:isAuthorized');

const isAuthorized = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      debug(`Required permission: ${requiredPermission}`);
      const { id, role } = req;
      debug(`Request params - id: ${id}, role: ${role}`);

      validateParams({ id, role });

      const hasPermission = await checkRequestedPermission(
        id,
        role,
        requiredPermission,
      );
      debug(`Has permission: ${hasPermission}`);

      if (!hasPermission) {
        debug('Access denied: User does not have the required permission.');
        return next(generateHttpError(403, 'Acesso não autorizado'));
      }

      debug('Access granted: User has the required permission.');
      next();
    } catch (error) {
      debug(`Internal server error: ${error.message}`);
      next(generateHttpError(500, 'Erro interno do servidor', error));
    }
  };
};

module.exports = isAuthorized;
