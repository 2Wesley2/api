const { check, validationResult } = require('express-validator');
const isValidCPF = require('../utils/cpfValidator');

const newUserRegistrationValidatorData = [
  check('cpf')
    .exists()
    .withMessage('CPF é obrigatório')
    .custom((value) => {
      if (!isValidCPF(value)) {
        throw new Error('Formato Inválido');
      }
      return true;
    }),
  check('phone')
    .exists()
    .withMessage('Número de telefone é obrigatório')
    .isMobilePhone('pt-BR')
    .withMessage('Número de telefone deve ser válido'),
  check('email')
    .exists()
    .withMessage('Email é obrigatório')
    .isEmail()
    .withMessage('Email inválido'),
  check('password')
    .exists()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter pelo menos 8 caracteres'),
  check('firstName')
    .exists()
    .withMessage('Nome é obrigatório')
    .isAlpha()
    .withMessage('Nome deve conter apenas letras')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter no mínimo 2 caracteres'),
  check('lastName')
    .exists()
    .withMessage('Sobrenome é obrigatório')
    .isAlpha()
    .withMessage('Sobrenome deve conter apenas letras')
    .isLength({ min: 2 })
    .withMessage('Sobrenome deve ter no mínimo 2 caracteres'),
  check('birthDate')
    .exists()
    .withMessage('Data de nascimento é obrigatória')
    .isISO8601()
    .toDate()
    .withMessage('Data de nascimento deve estar no formato AAAA-MM-DD'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorDetails = errors.array().map((err) => ({
        msg: err.msg,
        param: err.param,
        location: err.location,
      }));
      return res.status(400).json({
        messages: errorDetails.map((e) => e.msg),
        errors: errorDetails,
      });
    }
    next();
  },
];

module.exports = {
  newUserRegistrationValidatorData,
};
