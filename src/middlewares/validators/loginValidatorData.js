const { check, validationResult } = require('express-validator');
const generateHttpError = require('../../utils/generateHttpError');

const loginValidatorData = [
  check('email').optional().isEmail().withMessage('Email inválido'),
  check('phone')
    .optional()
    .isMobilePhone('pt-BR')
    .withMessage('Número de telefone deve ser válido'),
  check('email')
    .if(check('phone').not().exists())
    .exists()
    .withMessage('Email ou telefone é obrigatório'),
  check('phone')
    .if(check('email').not().exists())
    .exists()
    .withMessage('Email ou telefone é obrigatório'),
  check('password')
    .exists()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter pelo menos 8 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
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
  loginValidatorData,
};
