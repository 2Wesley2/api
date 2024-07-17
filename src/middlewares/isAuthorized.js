const User = require('../models/User');
const checkRequestedPermission = require('../service/checkRequestedPermission');

const isAuthorized = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      console.log('[isAuthorized] Iniciando middleware');
      const { id, role } = req;

      console.log('[isAuthorized] ID recebido:', id);
      console.log('[isAuthorized] Role recebida:', role);

      if (!id || !role) {
        console.log('[isAuthorized] ID ou Role não fornecido');
        return res.status(400).json({ message: 'ID ou Role não fornecido' });
      }

      const pipeline = checkRequestedPermission(id, role, requiredPermission);
      console.log('[isAuthorized] Pipeline gerado:', pipeline);

      const result = await User.aggregate(pipeline);
      console.log('[isAuthorized] Resultado da agregação:', result);

      if (!(result.length > 0 && result[0].matchingDocuments > 0)) {
        console.log(
          '[isAuthorized] Acesso não autorizado. Nenhum documento correspondente encontrado',
        );
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }
      console.log(
        '[isAuthorized] Acesso autorizado. Passando para o próximo middleware',
      );
      next();
    } catch (error) {
      console.error('[isAuthorized] Erro ao verificar token:', error.message);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };
};

module.exports = isAuthorized;
