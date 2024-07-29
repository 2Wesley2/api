const jwt = require('jsonwebtoken');
const util = require('util');
const verifyToken = util.promisify(jwt.verify);
require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');

const JWT_SECRET = process.env.JWT_SECRET;
if (!process.env.JWT_SECRET) {
  console.error('[isAuthenticated] JWT_SECRET não está definido.');
  throw new Error('Erro interno do servidor: JWT_SECRET não está definido.');
}

const isAuthenticated = (shouldLoggedIn = true) => {
  return async (req, res, next) => {
    const token = req.cookies.token;
    if (shouldLoggedIn) {
      // O usuário deve estar autenticado para acessar a rota
      if (!token) {
        return next(
          generateHttpError(401, 'Acesso negado. Usuário não autenticado.'),
        );
      }
      try {
        const decoded = await verifyToken(token, JWT_SECRET);
        validateParams({ role: decoded.role, id: decoded.id }, 401);
        req.role = decoded.role;
        req.id = decoded.id;
        req.user = decoded;
        req.user.profile = decoded.profile;
        return next();
      } catch (error) {
        console.error('[isAuthenticated] Erro ao verificar token:', error);
        return next(
          generateHttpError(401, 'Token inválido ou expirado.', error),
        );
      }
    } else {
      // O usuário não deve estar autenticado para acessar a rota (rota de login)
      if (token) {
        try {
          const decoded = await verifyToken(token, JWT_SECRET);
          validateParams({ role: decoded.role, id: decoded.id }, 401);
          return next(generateHttpError(401, 'Usuário já está logado.'));
        } catch (error) {
          console.error('[isAuthenticated] Erro ao verificar token:', error);
          return next(
            generateHttpError(401, 'Token inválido ou expirado.', error),
          );
        }
      }
      return next();
    }
  };
};
module.exports = isAuthenticated;
