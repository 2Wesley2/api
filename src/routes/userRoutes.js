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

// Import authentication and authorization middleware
const isAuthenticated = require('../middlewares/auth/isAuthenticated.js');
const isAuthorized = require('../middlewares/auth/isAuthorized.js');

// Import validation middleware
const checkPersonAndUserUniquenessMiddleware = require('../middlewares/validators/checkPersonAndUserUniquenessMiddleware.js');
const {
  newUserRegistrationValidatorData,
} = require('../middlewares/validators/newUserRegistrationValidatorData.js');

//routes
router.post(
  '/register_retailer',
  isAuthenticated(false),
  newUserRegistrationValidatorData,
  checkPersonAndUserUniquenessMiddleware,
  startTransactionMiddleware,
  registerRetailer,
  endTransactionMiddleware,
);

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

module.exports = router;
