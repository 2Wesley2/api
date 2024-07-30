const Person = require('../../models/Person');
const User = require('../../models/User');
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');
const debug = require('debug')('app:checkPersonAndUserUniqueness');

const checkPersonAndUserUniquenessMiddleware = async (req, res, next) => {
  try {
    const { cpf, email, phone } = req.body;
    debug('Validating request parameters');
    validateParams({ cpf, email, phone });
    debug('Checking for existing person and user records');

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
      debug(`Found validation errors: ${errors.join(', ')}`);
      return next(generateHttpError(409, errors.join(', ')));
    }

    debug('No conflicts found, proceeding to next middleware');
    next();
  } catch (error) {
    debug(`Error during uniqueness check: ${error.message}`);
    next(generateHttpError(500, 'Erro ao verificar dados do usuário', error));
  }
};

module.exports = checkPersonAndUserUniquenessMiddleware;
