const generateHttpError = require('../../utils/generateHttpError');
const debug = require('debug')('app:endTransaction');

const endTransactionMiddleware = async (req, res, next) => {
  const session = req.session;

  if (!session) {
    console.error('Sessão de transação não encontrada');
    debug('Transaction session not found');
    return next(generateHttpError(500, 'Sessão de transação não encontrada'));
  }

  try {
    debug('Committing transaction');
    await session.commitTransaction();
    res.locals.transactionCommitted = true;
    debug('Transaction committed successfully');
    if (res.locals.successResponse) {
      debug('Sending success response');
      return res
        .status(res.locals.successResponse.status)
        .json(res.locals.successResponse);
    }
  } catch (error) {
    await session.abortTransaction();
    console.error('Erro ao confirmar a transação:', error);
    debug(`Error committing transaction: ${error.message}`);
    next(generateHttpError(500, 'Erro ao confirmar a transação', error));
  } finally {
    debug('Ending transaction session');
    session.endSession();
  }
};

module.exports = endTransactionMiddleware;
