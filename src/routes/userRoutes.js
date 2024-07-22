// Import libraries and modules
const express = require('express');
const router = express.Router();

// Import transaction middleware
const startTransactionMiddleware = require('../middlewares/transaction/startTransaction.js');
const endTransactionMiddleware = require('../middlewares/transaction/endTransaction.js');

// Import controllers
const {
  registerRetailer,
} = require('../controllers/userControllers/registerRetailer.js');
const {
  registerAdmin,
} = require('../controllers/userControllers/registerAdmin.js');
const { loginUser } = require('../controllers/userControllers/login.js');
const { logoutUser } = require('../controllers/userControllers/logout.js');
const {
  createProfile,
} = require('../controllers/profileControllers/createProfile.js');

// Import authentication and authorization middleware
const isAuthenticated = require('../middlewares/auth/isAuthenticated.js');
const isAuthorized = require('../middlewares/auth/isAuthorized.js');
const loginLimiter = require('../middlewares/auth/loginRateLimiter.js');

// Import validation middleware
const checkPersonAndUserUniquenessMiddleware = require('../middlewares/validators/checkPersonAndUserUniquenessMiddleware.js');
const {
  newUserRegistrationValidatorData,
} = require('../middlewares/validators/newUserRegistrationValidatorData.js');
const {
  loginValidatorData,
} = require('../middlewares/validators/loginValidatorData.js');
const checkUserHasProfileMiddleware = require('../middlewares/validators/checkUserHasProfileMiddleware.js');

//routes
router.post(
  '/register_retailer',
  newUserRegistrationValidatorData,
  checkPersonAndUserUniquenessMiddleware,
  startTransactionMiddleware,
  registerRetailer,
  endTransactionMiddleware,
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

router.post(
  '/create_profile',
  isAuthenticated,
  isAuthorized('create_profile'),
  checkUserHasProfileMiddleware,
  startTransactionMiddleware,
  createProfile,
  endTransactionMiddleware,
);

module.exports = router;
