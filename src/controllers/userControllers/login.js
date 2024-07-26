const jwt = require('jsonwebtoken');
const validateLoginCredentials = require('../../utils/validateLoginCredentials');
require('dotenv').config();
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');

const COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  secure: process.env.SECURE_COOKIES === 'true',
  sameSite: process.env.COOKIE_SAME_SITE === 'Strict' ? 'Strict' : 'Lax',
});

const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password, phone } = req.body;
    validateParams({ password });

    if (!email && !phone) {
      return next(
        generateHttpError(400, 'Por favor, forneça um email ou um telefone.'),
      );
    }

    const user = await validateLoginCredentials(email, phone, password);

    const payload = user;

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });
    res.cookie('token', token, COOKIE_OPTIONS);
    return res.status(200).json({ message: 'Logado com sucesso' });
  } catch (error) {
    console.error('[loginUser] Erro durante o login:', error);
    next(generateHttpError(500, 'Erro durante o login', error));
  }
};
