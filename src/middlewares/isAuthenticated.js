const jwt = require('jsonwebtoken');
const util = require('util');
const handleValidationErrors = require('../utils/handleValidationErrors');
const verifyToken = util.promisify(jwt.verify);
require('dotenv').config();

const isAuthenticated = async (req, res, next) => {
  const errors = [];
  const token = req.cookies.token;

  if (!token) {
    errors.push({
      status: 401,
      msg: 'Acesso negado. Usuário não autenticado.',
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('[isAuthenticated] JWT_SECRET não está definido.');
    errors.push({
      status: 500,
      msg: 'Erro interno do servidor.',
    });
  }

  if (errors.length > 0) {
    return handleValidationErrors(errors, res);
  }

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    if (!decoded.role || !decoded.id) {
      errors.push({ status: 401, msg: 'Campos ausentes.' });
    } else {
      req.role = decoded.role;
      req.id = decoded.id;

      next();
      return; //não deve ser removido para evitar a chamada da linha 52 quando o middleware for passado pra frente
    }
  } catch (error) {
    console.error('[isAuthenticated] Erro ao verificar token:', error.message);
    errors.push({
      status: 401,
      msg: 'Token inválido ou expirado.',
    });
  }

  handleValidationErrors(errors, res);
};

module.exports = isAuthenticated;
