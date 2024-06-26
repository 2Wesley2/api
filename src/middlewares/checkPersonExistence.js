const Person = require('../models/Person');

const checkPersonExistence = async (req, res, next) => {
  try {
    const { personData } = req.body;
    const person = await Person.findOne({ cpf: personData.cpf }).lean();
    if (person) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }
    req.personData = personData;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao verificar CPF da pessoa', error });
  }
};

module.exports = checkPersonExistence;
