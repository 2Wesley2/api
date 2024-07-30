const jwt = require('jsonwebtoken');
const util = require('util');
const verifyToken = util.promisify(jwt.verify);
require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');
const debug = require('debug')('app:isAuthenticated');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('[isAuthenticated] JWT_SECRET não está definido.');
  throw new Error('Erro interno do servidor: JWT_SECRET não está definido.');
}

const isAuthenticated = (shouldLoggedIn = true) => {
  return async (req, res, next) => {
    const token = req.cookies.token;
    if (shouldLoggedIn) {
      debug('Rota requer autenticação.');
      // O usuário deve estar autenticado para acessar a rota
      if (!token) {
        debug('Token não encontrado. Usuário não autenticado.');
        return next(
          generateHttpError(401, 'Acesso negado. Usuário não autenticado.'),
        );
      }
      try {
        const decoded = await verifyToken(token, JWT_SECRET);
        debug('Token verificado com sucesso.');
        debug(`Decoded token: ${JSON.stringify(decoded)}`);

        validateParams({ role: decoded.role, id: decoded.id }, 401);
        req.role = decoded.role;
        req.id = decoded.id;
        req.user = decoded;
        req.user.profile = decoded.profile;

        debug(`Requisição do usuário: ${JSON.stringify(req.user)}`);

        return next();
      } catch (error) {
        console.error('[isAuthenticated] Erro ao verificar token:', error);
        debug(`Erro ao verificar token: ${error.message}`);
        return next(
          generateHttpError(401, 'Token inválido ou expirado.', error),
        );
      }
    } else {
      debug(
        'Rota não requer autenticação (rota de login ou registro de retailer).',
      );
      // O usuário não deve estar autenticado para acessar a rota (rota de login)
      if (token) {
        debug('Token encontrado. Usuário já está logado.');
        try {
          const decoded = await verifyToken(token, JWT_SECRET);

          debug('Token verificado com sucesso.');
          debug(`Decoded token: ${JSON.stringify(decoded)}`);

          validateParams({ role: decoded.role, id: decoded.id }, 401);
          return next(generateHttpError(401, 'Usuário já está logado.'));
        } catch (error) {
          console.error('[isAuthenticated] Erro ao verificar token:', error);
          debug(`Erro ao verificar token: ${error.message}`);
          return next(
            generateHttpError(401, 'Token inválido ou expirado.', error),
          );
        }
      }
      debug('Nenhum token encontrado. Prosseguindo para a próxima etapa.');
      return next();
    }
  };
};
module.exports = isAuthenticated;
