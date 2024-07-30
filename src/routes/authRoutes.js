const express = require('express');
const router = express.Router();
const { loginUser, logoutUser } = require('../controllers/userControllers');
const isAuthenticated = require('../middlewares/auth/isAuthenticated.js');
const loginLimiter = require('../middlewares/auth/loginRateLimiter.js');
const {
  loginValidatorData,
} = require('../middlewares/validators/loginValidatorData.js');

router.post(
  '/login',
  loginLimiter,
  isAuthenticated(false),
  loginValidatorData,
  loginUser,
);

router.post('/logout', isAuthenticated(true), logoutUser);

module.exports = router;
