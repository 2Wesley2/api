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

const isAuthenticated = require('../middlewares/isAuthenticated');
const isAuthorized = require('../middlewares/isAuthorized');
const checkPersonAndUserUniquenessMiddleware = require('../middlewares/checkPersonAndUserUniquenessMiddleware');

const {
  newUserRegistrationValidatorData,
} = require('../middlewares/newUserRegistrationValidatorData.js');

const { loginValidatorData } = require('../middlewares/loginValidatorData.js');
const loginLimiter = require('../middlewares/loginRateLimiter');

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
  registerAdmin,
);

/*
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateAndSanitize, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

*/

module.exports = router;
