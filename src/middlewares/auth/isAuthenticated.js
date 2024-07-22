const jwt = require('jsonwebtoken');
const util = require('util');
const verifyToken = util.promisify(jwt.verify);
require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');
const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(
      generateHttpError(401, 'Acesso negado. Usuário não autenticado.'),
    );
  }

  if (!process.env.JWT_SECRET) {
    console.error('[isAuthenticated] JWT_SECRET não está definido.');
    return next(generateHttpError(500, 'Erro interno do servidor.'));
  }

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    if (!decoded.role || !decoded.id) {
      return next(generateHttpError(401, 'Campos ausentes.'));
    } else {
      req.role = decoded.role;
      req.id = decoded.id;

      next();
    }
  } catch (error) {
    next(generateHttpError(401, 'Token inválido ou expirado.', error));
  }
};

module.exports = isAuthenticated;
