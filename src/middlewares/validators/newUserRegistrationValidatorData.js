const { check, validationResult } = require('express-validator');
const isValidCPF = require('../../utils/cpfValidator');
const generateHttpError = require('../../utils/generateHttpError');

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
  check('storeName')
    .exists()
    .withMessage('Nome da loja é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Nome da loja deve ter no mínimo 2 caracteres'),
  check('storeAddress')
    .exists()
    .withMessage('Endereço da loja é obrigatório')
    .isLength({ min: 5 })
    .withMessage('Endereço da loja deve ter no mínimo 5 caracteres'),
  check('storeContact')
    .exists()
    .withMessage('Contato da loja é obrigatório')
    .isMobilePhone('pt-BR')
    .withMessage('Contato da loja deve ser um número de telefone válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorDetails = errors.array().map((err) => ({
        msg: err.msg,
        param: err.param,
        location: err.location,
      }));
      next(generateHttpError(400, 'Erro de validação', errorDetails));
    }
    next();
  },
];

module.exports = {
  newUserRegistrationValidatorData,
};
