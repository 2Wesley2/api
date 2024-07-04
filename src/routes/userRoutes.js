const express = require('express');
const router = express.Router();
const {
  registerRetailer,
} = require('../controllers/userControllers/registerRetailer');
const {
  registerAdmin,
} = require('../controllers/userControllers/registerAdmin');
const { loginUser } = require('../controllers/userControllers/login');
const { logoutUser } = require('../controllers/userControllers/logout');

const authenticateTokenMiddleware = require('../middlewares/authenticateTokenMiddleware');
const checkPersonAndUserUniquenessMiddleware = require('../middlewares/checkPersonAndUserUniquenessMiddleware');
const {
  validateAndSanitizeMiddleware,
} = require('../middlewares/validateAndSanitizeMiddleware');
const loginLimiter = require('../middlewares/loginRateLimiter');
const checkAdminPermission = require('../middlewares/checkAdminPermission');
router.post(
  '/register_retailer',
  validateAndSanitizeMiddleware,
  checkPersonAndUserUniquenessMiddleware,
  registerRetailer,
);

router.post('/login', loginLimiter, loginUser);
router.post('/logout', authenticateTokenMiddleware, logoutUser);
router.post(
  '/register_admin',
  authenticateTokenMiddleware,
  checkAdminPermission,
  validateAndSanitizeMiddleware,
  checkPersonAndUserUniquenessMiddleware,
  registerAdmin,
);

/*
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateAndSanitize, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

*/

module.exports = router;
