const validateUserPermissions = require('../utils/validateUserPermissions');

const checkAdminPermission = async (req, res, next) => {
  const userId = req.id;
  try {
    const errors = await validateUserPermissions(userId);
    if (errors.length > 0) {
      const highestStatus = errors.reduce(
        (highest, error) => Math.max(highest, error.status),
        400,
      );
      return res.status(highestStatus).json({
        messages: errors.map((e) => e.msg),
        errors: errors,
      });
    }
    next();
  } catch (error) {
    console.error('Erro durante a validação das permissões:', error.message);
    res.status(500).json({
      message: 'Erro ao verificar permissões',
      error: error.message,
    });
  }
};

module.exports = checkAdminPermission;
