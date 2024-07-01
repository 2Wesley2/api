const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: {
    message:
      'Muitas tentativas de login. Por favor, tente novamente mais tarde.',
  },
  standardHeaders: true, // Retorna informações de limite de taxa nos cabeçalhos "RateLimit-*"
  legacyHeaders: false, // Desabilita os cabeçalhos de limite de taxa "X-RateLimit-*"
});

module.exports = loginLimiter;
