const mongoose = require('mongoose');
const generateHttpError = require('../../utils/generateHttpError');
const debug = require('debug')('app:startTransaction');

const startTransactionMiddleware = async (req, res, next) => {
  try {
    debug('Starting a new transaction session');
    req.session = await mongoose.startSession();
    req.session.startTransaction();
    debug('Transaction session started successfully');

    next();
  } catch (error) {
    console.error('Erro ao iniciar transação:', error.message);
    debug(`Error starting transaction: ${error.message}`);
    next(generateHttpError(500, 'Erro ao iniciar transação', error));
  }
};

module.exports = startTransactionMiddleware;
