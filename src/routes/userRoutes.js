const express = require('express');
const router = express.Router();
const startTransactionMiddleware = require('../middlewares/transaction/startTransaction.js');
const endTransactionMiddleware = require('../middlewares/transaction/endTransaction.js');
const {
  registerRetailer,
} = require('../controllers/userControllers/registerRetailer.js');
const {
  registerAdmin,
} = require('../controllers/userControllers/registerAdmin.js');
const { loginUser } = require('../controllers/userControllers/login.js');
const { logoutUser } = require('../controllers/userControllers/logout.js');

const isAuthenticated = require('../middlewares/auth/isAuthenticated.js');
const isAuthorized = require('../middlewares/auth/isAuthorized.js');
const checkPersonAndUserUniquenessMiddleware = require('../middlewares/validators/checkPersonAndUserUniquenessMiddleware.js');

const {
  newUserRegistrationValidatorData,
} = require('../middlewares/validators/newUserRegistrationValidatorData.js');

const {
  loginValidatorData,
} = require('../middlewares/validators/loginValidatorData.js');
const loginLimiter = require('../middlewares/loginRateLimiter.js');

router.post(
  '/register_retailer',
  newUserRegistrationValidatorData,
  checkPersonAndUserUniquenessMiddleware,
  registerRetailer,
);

router.post('/login', loginLimiter, loginValidatorData, loginUser);
router.post('/logout', logoutUser);
router.post(
  '/register_admin',
  isAuthenticated,
  isAuthorized('register_admin'),
  newUserRegistrationValidatorData,
  checkPersonAndUserUniquenessMiddleware,
  startTransactionMiddleware,
  registerAdmin,
  endTransactionMiddleware,
);

/*
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateAndSanitize, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

*/

module.exports = router;
