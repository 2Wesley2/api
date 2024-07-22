const mongoose = require('mongoose');
const generateHttpError = require('../../utils/generateHttpError');

const startTransactionMiddleware = async (req, res, next) => {
  try {
    req.session = await mongoose.startSession();
    req.session.startTransaction();
    next();
  } catch (error) {
    console.error('Erro ao iniciar transação:', error.message);
    next(generateHttpError(500, 'Erro ao iniciar transação', error));
  }
};

module.exports = startTransactionMiddleware;
