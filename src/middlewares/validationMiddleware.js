const { check, validationResult } = require('express-validator');
const isValidCPF = require('../utils/cpfValidator');

const validateAndSanitize = [
  check('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  check('password')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter pelo menos 8 caracteres'),
  check('cpf').custom((value) => {
    if (!isValidCPF(value)) {
      throw new Error('Formato Inválido');
    }
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateAndSanitize,
};
