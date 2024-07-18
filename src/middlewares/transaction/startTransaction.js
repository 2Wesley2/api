const mongoose = require('mongoose');

const startTransactionMiddleware = async (req, res, next) => {
  try {
    req.session = await mongoose.startSession();
    req.session.startTransaction();
    next();
  } catch (error) {
    console.error('Erro ao iniciar transação:', error.message);
    res.status(500).json({ message: 'Erro ao iniciar transação', error });
  }
};

module.exports = startTransactionMiddleware;
