const { check, validationResult } = require('express-validator');
const generateHttpError = require('../../utils/generateHttpError');

const storeValidator = [
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
    } else {
      next();
    }
  },
];

module.exports = storeValidator;
