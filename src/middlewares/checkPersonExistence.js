const mongoose = require('mongoose');
const Person = require('../models/Person');

const checkPersonExistence = async (req, res, next) => {
  const session = await mongoose.startTransaction();
  session.startTransaction();
  try {
    const { personData } = req.body;
    const person = await Person.findOne({ cpf: personData.cpf })
      .session(session)
      .lean();
    if (person) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'CPF já cadastrado' });
    }
    req.personData = personData;
    await session.commitTransaction();
    next();
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      message: 'Erro ao verificar CPF da pessoa',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

module.exports = checkPersonExistence;
