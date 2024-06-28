const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();

const checkAuthForRole = (req, res, next) => {
  if (req.body.rolePermission === process.env.ADMIN_ROLE_PERMISSION) {
    return authMiddleware(req, res, next);
  }
  next();
};

module.exports = checkAuthForRole;
