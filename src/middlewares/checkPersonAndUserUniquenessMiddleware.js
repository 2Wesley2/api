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

    if (person) {
      return res.status(409).json({ message: 'CPF já cadastrado' });
    }

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Email ou telefone já cadastrados.' });
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
