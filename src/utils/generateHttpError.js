/**
 * Gera um erro HTTP com uma mensagem e um status especificados.
 *
 * @param {number} status - O código de status HTTP.
 * @param {string} message - A mensagem de erro.
 * @param {Error|null} [originalError=null] - O erro original, se houver.
 * @returns {Error} - O objeto de erro gerado.
 */

const generateHttpError = (status, message, originalError = null) => {
  const error = new Error(message);
  if (originalError) {
    error.originalError = {
      message: originalError.message,
      stack: originalError.stack,
    };
  }
  return error;
};

module.exports = generateHttpError;
