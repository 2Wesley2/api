const jwt = require('jsonwebtoken');
const validateLoginCredentials = require('../../utils/validateLoginCredentials');
const handleValidationErrors = require('../../utils/handleValidationErrors');
require('dotenv').config();

const COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  secure: process.env.SECURE_COOKIES === 'true',
  sameSite: process.env.COOKIE_SAME_SITE === 'Strict' ? 'Strict' : 'Lax',
});

const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

exports.loginUser = async (req, res) => {
  try {
    console.log('[loginUser] Iniciando login');
    const { email, password, phone } = req.body;
    console.log('[loginUser] Dados recebidos:', { email, password, phone });
    const { errors, user } = await validateLoginCredentials(
      email,
      phone,
      password,
    );
    console.log('[loginUser] Resultado da validação:', { errors, user });
    if (errors.length > 0) {
      console.log('[loginUser] Erros de validação encontrados:', errors);
      return handleValidationErrors(errors, res);
    }

    const payload = user;
    console.log('[loginUser] Payload para o token:', payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });
    console.log('[loginUser] Token gerado:', token);
    res.cookie('token', token, COOKIE_OPTIONS);
    console.log('[loginUser] Cookie definido com opções:', COOKIE_OPTIONS);
    return res.status(200).json({ message: 'Logado com sucesso' });
  } catch (error) {
    console.error('[loginUser] Erro durante o login:', error);
    res
      .status(500)
      .json({ message: 'Erro ao fazer login', error: error.message });
  }
};
