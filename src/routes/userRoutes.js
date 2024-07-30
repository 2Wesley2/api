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
  createStore,
} = require('../controllers/storeControllers/createStore.js');

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
const storeValidator = require('../middlewares/validators/storeValidator.js');

//depur
const debug = require('debug')('app:routes');

//routes
router.post(
  '/register_retailer',
  (req, res, next) => {
    debug('Entering route /register_retailer');
    next();
  },
  isAuthenticated(false),
  (req, res, next) => {
    debug('Passed isAuthenticated');
    next();
  },
  newUserRegistrationValidatorData,
  (req, res, next) => {
    debug('Passed newUserRegistrationValidatorData');
    next();
  },
  checkPersonAndUserUniquenessMiddleware,
  (req, res, next) => {
    debug('Passed checkPersonAndUserUniquenessMiddleware');
    next();
  },
  startTransactionMiddleware,
  (req, res, next) => {
    debug('Passed startTransactionMiddleware');
    next();
  },
  registerRetailer,
  (req, res, next) => {
    debug('Passed registerRetailer');
    next();
  },

  endTransactionMiddleware,
  (req, res, next) => {
    debug('Passed endTransactionMiddleware');
    next();
  },
);

router.post(
  '/login',
  loginLimiter,
  isAuthenticated(false),
  loginValidatorData,
  loginUser,
);

router.post('/logout', isAuthenticated(true), logoutUser);

router.post(
  '/register_admin',
  isAuthenticated(true),
  isAuthorized('register_admin'),
  newUserRegistrationValidatorData,
  checkPersonAndUserUniquenessMiddleware,
  startTransactionMiddleware,
  registerAdmin,
  endTransactionMiddleware,
);

router.post(
  '/create_store',
  isAuthenticated(true),
  isAuthorized('create_store'),
  storeValidator,
  startTransactionMiddleware,
  createStore,
  endTransactionMiddleware,
);

module.exports = router;
