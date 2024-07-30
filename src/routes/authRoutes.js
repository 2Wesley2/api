const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authControllers/login.js');
const { logoutUser } = require('../controllers/authControllers/logout.js');
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
