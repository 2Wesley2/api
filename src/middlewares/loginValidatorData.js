const { check, validationResult } = require('express-validator');

const loginValidatorData = [
  check('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
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
  loginValidatorData,
};
