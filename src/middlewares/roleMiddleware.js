const { checkPermission } = require('../helpers/permissionHelpers');

const roleMiddleware = (requiredPermission) => async (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Acesso negado. Usuário não autenticado.' });
  }
  const hasPermission = await checkPermission(req.user.id, requiredPermission);
  if (!hasPermission) {
    return res
      .status(403)
      .json({ message: 'Acesso negado. Função insuficiente.' });
  }
  next();
};

module.exports = roleMiddleware;
