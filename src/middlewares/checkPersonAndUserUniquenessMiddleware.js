const Person = require('../models/Person');
const User = require('../models/User');

const checkPersonAndUserUniquenessMiddleware = async (req, res, next) => {
  try {
    const { cpf, email, phone } = req.body;
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
      return res.status(409).json({ messages: errors });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao verificar dados do usuário',
      error: error.message,
    });
  }
};

module.exports = checkPersonAndUserUniquenessMiddleware;
