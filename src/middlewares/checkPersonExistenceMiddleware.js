const mongoose = require('mongoose');
const Person = require('../models/Person');

const checkPersonExistenceMiddleware = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { cpf } = req.body;
    const person = await Person.findOne({ cpf }).session(session).lean();
    if (person) {
      await session.abortTransaction();
      return res.status(409).json({ message: 'CPF já cadastrado' });
    }
    await session.commitTransaction();
    next();
  } catch (error) {
    await session.abortTransaction();
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'CPF já cadastrado',
      });
    }
    res.status(500).json({
      message: 'Erro ao verificar CPF da pessoa',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

module.exports = checkPersonExistenceMiddleware;
