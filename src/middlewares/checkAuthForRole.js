const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();

const checkAuthForRole = (req, res, next) => {
  if (req.body.role === process.env.ADMIN_ROLE_PERMISSION_ID) {
    return authMiddleware(req, res, next);
  }
  next();
};

module.exports = checkAuthForRole;
