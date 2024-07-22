const generateHttpError = require('../../utils/generateHttpError');

const endTransactionMiddleware = async (req, res, next) => {
  const session = req.session;
  if (!session) {
    return next(generateHttpError(500, 'Sessão de transação não encontrada'));
  }
  try {
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Erro ao confirmar a transação:', error);
    next(generateHttpError(500, 'Erro ao confirmar a transação', error));
  } finally {
    session.endSession();
  }
  next();
};

module.exports = endTransactionMiddleware;
