const express = require('express');
const router = express.Router();
const startTransactionMiddleware = require('../middlewares/transaction/startTransaction.js');
const endTransactionMiddleware = require('../middlewares/transaction/endTransaction.js');
const { createStore } = require('../controllers/storeControllers');
const isAuthenticated = require('../middlewares/auth/isAuthenticated.js');
const isAuthorized = require('../middlewares/auth/isAuthorized.js');
const storeValidator = require('../middlewares/validators/storeValidator.js');

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
