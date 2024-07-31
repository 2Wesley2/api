const express = require('express');
const router = express.Router();
const startTransactionMiddleware = require('../middlewares/transaction/startTransaction.js');
const endTransactionMiddleware = require('../middlewares/transaction/endTransaction.js');
const registerCustomer = require('../controllers/customerControllers/registerCustomer.js');
const isAuthenticated = require('../middlewares/auth/isAuthenticated.js');
const isAuthorized = require('../middlewares/auth/isAuthorized.js');
const customerValidator = require('../middlewares/validators/customerValidator.js');
const deleteCustomer = require('../controllers/customerControllers/deleteCustomer.js');
router.post(
  '/:storeId/register_customer',
  isAuthenticated(true),
  isAuthorized('register_customer'),
  customerValidator,
  startTransactionMiddleware,
  registerCustomer,
  endTransactionMiddleware,
);

// Rota para deletar um cliente
router.delete(
  '/:storeId/customers/:customerId',
  isAuthenticated(true),
  isAuthorized('delete_customer'),
  startTransactionMiddleware,
  deleteCustomer,
  endTransactionMiddleware,
);

module.exports = router;
