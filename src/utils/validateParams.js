const generateHttpError = require('./generateHttpError');

/**
 * Valida se os parâmetros obrigatórios estão presentes.
 *
 * @param {Object} params - Objeto contendo os parâmetros a serem validados.
 * @param {number} [status=400] - Código de status HTTP a ser usado em caso de erro.
 * @throws {Error} - Gera um erro HTTP se algum parâmetro estiver ausente.
 */
const validateParams = (params, status = 400) => {
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      throw generateHttpError(status, `O campo "${key}" é obrigatório`);
    }
  }
};

module.exports = validateParams;
