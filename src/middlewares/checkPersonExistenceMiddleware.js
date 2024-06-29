const Person = require('../models/Person');

const checkPersonExistenceMiddleware = async (req, res, next) => {
  try {
    const { cpf } = req.body;
    const person = await Person.findOne({ cpf }).lean();
    if (person) {
      return res.status(409).json({ message: 'CPF já cadastrado' });
    }
    next();
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'CPF já cadastrado',
      });
    }
    res.status(500).json({
      message: 'Erro ao verificar CPF da pessoa',
      error: error.message,
    });
  }
};

module.exports = checkPersonExistenceMiddleware;
