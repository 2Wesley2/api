const generateHttpError = (status, message, originalError = null) => {
  const error = new Error(message);
  error.status = status;
  error.originalError = originalError;
  return error;
};

module.exports = generateHttpError;
