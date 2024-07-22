const Person = require('../../models/Person');
const User = require('../../models/User');
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');

const checkPersonAndUserUniquenessMiddleware = async (req, res, next) => {
  try {
    const { cpf, email, phone } = req.body;
    validateParams({ cpf, email, phone });
    const [person, existingUser] = await Promise.all([
      Person.findOne({ cpf }).lean(),
      User.findOne({
        $or: [{ email }, { phone }],
      }).lean(),
    ]);

    const errors = [
      person ? 'CPF já cadastrado' : null,
      existingUser && existingUser.email === email
        ? 'Email já cadastrado'
        : null,
      existingUser && existingUser.phone === phone
        ? 'Telefone já cadastrado'
        : null,
    ].filter(Boolean);

    if (errors.length > 0) {
      return next(generateHttpError(409, errors.join(', ')));
    }

    next();
  } catch (error) {
    next(generateHttpError(500, 'Erro ao verificar dados do usuário', error));
  }
};

module.exports = checkPersonAndUserUniquenessMiddleware;
