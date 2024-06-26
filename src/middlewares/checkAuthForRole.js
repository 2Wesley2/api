const authMiddleware = require('../middlewares/authMiddleware');

const checkAuthForRole = (req, res, next) => {
  if (req.body.role === 'admin') {
    return authMiddleware(req, res, next);
  }
  next();
};

module.exports = checkAuthForRole;
