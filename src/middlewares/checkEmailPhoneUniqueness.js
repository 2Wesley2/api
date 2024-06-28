const mongoose = require('mongoose');
const User = require('../models/User');

const checkEmailPhoneUniqueness = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: 'Por favor, forneça um email ou um telefone.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    })
      .session(session)
      .lean();

    if (existingUser) {
      await session.abortTransaction();
      return res
        .status(409)
        .json({ message: 'Email ou telefone já cadastrados.' });
    }
    await session.commitTransaction();
    next();
  } catch (error) {
    await session.abortTransaction();
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Email ou telefone já cadastrados.' });
    }
    res.status(500).json({
      message: 'Erro ao verificar unicidade de email e telefone',
      error,
    });
  } finally {
    session.endSession();
  }
};

module.exports = checkEmailPhoneUniqueness;
