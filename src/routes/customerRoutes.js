const express = require('express');
const router = express.Router();
const startTransactionMiddleware = require('../middlewares/transaction/startTransaction.js');
const endTransactionMiddleware = require('../middlewares/transaction/endTransaction.js');
const registerCustomer = require('../controllers/customerControllers/registerCustomer.js');
const isAuthenticated = require('../middlewares/auth/isAuthenticated.js');
const isAuthorized = require('../middlewares/auth/isAuthorized.js');
const customerValidator = require('../middlewares/validators/customerValidator.js');

router.post(
  '/:storeId/register_customer',
  isAuthenticated(true),
  isAuthorized('register_customer'),
  customerValidator,
  startTransactionMiddleware,
  registerCustomer,
  endTransactionMiddleware,
);

module.exports = router;
