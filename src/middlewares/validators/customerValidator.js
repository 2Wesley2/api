const { check, validationResult } = require('express-validator');
const isValidCPF = require('../../utils/cpfValidator');
const generateHttpError = require('../../utils/generateHttpError');

const customerValidator = [
  check('cpf')
    .exists()
    .withMessage('CPF é obrigatório')
    .custom((value) => {
      if (!isValidCPF(value)) {
        throw new Error('Formato de CPF inválido');
      }
      return true;
    }),
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
      return next(generateHttpError(400, 'Erro de validação', errorDetails));
    }
    next();
  },
];

module.exports = customerValidator;
