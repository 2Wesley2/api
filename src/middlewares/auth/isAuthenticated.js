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

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

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

    return next();
  } catch (error) {
    console.error('[isAuthenticated] Erro ao verificar token:', error);
    next(generateHttpError(401, 'Token inválido ou expirado.', error));
  }
};

module.exports = isAuthenticated;
