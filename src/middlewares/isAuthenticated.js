const jwt = require('jsonwebtoken');
const util = require('util');
const handleValidationErrors = require('../utils/handleValidationErrors');
const verifyToken = util.promisify(jwt.verify);
require('dotenv').config();

const isAuthenticated = async (req, res, next) => {
  const errors = [];
  const token = req.cookies.token;

  console.log('[isAuthenticated] Iniciando middleware');
  console.log('[isAuthenticated] Token recebido:', token);

  if (!token) {
    console.log('[isAuthenticated] Nenhum token encontrado nos cookies');
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
    console.log(
      '[isAuthenticated] Erros encontrados antes da verificação do token:',
      errors,
    );
    return handleValidationErrors(errors, res);
  }

  try {
    console.log('[isAuthenticated] Verificando token...');
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    console.log('[isAuthenticated] Token decodificado:', decoded);
    if (!decoded.role || !decoded.id) {
      console.log(
        '[isAuthenticated] Campos ausentes no token decodificado:',
        decoded,
      );
      errors.push({
        status: 401,
        msg: 'Campos ausentes.',
      });
    } else {
      console.log(
        '[isAuthenticated] Token válido. Adicionando role e id à requisição',
      );
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
  console.log(
    '[isAuthenticated] Erros encontrados após a verificação do token:',
    errors,
  );
  handleValidationErrors(errors, res);
};

module.exports = isAuthenticated;
