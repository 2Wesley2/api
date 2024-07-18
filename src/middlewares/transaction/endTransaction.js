const endTransactionMiddleware = async (req, res, next) => {
  const session = req.session;
  if (!session) {
    return next(new Error('Sessão de transação não encontrada'));
  }
  try {
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Erro ao confirmar a transação:', error);
  } finally {
    session.endSession();
  }
  next();
};

module.exports = endTransactionMiddleware;