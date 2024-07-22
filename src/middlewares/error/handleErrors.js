// eslint-disable-next-line no-unused-vars
const handleErrors = (err, req, res, next) => {
  if (err.originalError) {
    console.error(err.originalError.stack);
  } else {
    console.error(err.stack);
  }

  const status = err.status || 500;
  const message = err.message || 'Algo deu errado!';

  return res.status(status).json({
    error: message,
    originalError: err.originalError
      ? err.originalError.message || err.originalError
      : undefined,
  });
};

module.exports = handleErrors;
