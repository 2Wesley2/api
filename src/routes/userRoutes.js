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

const authenticateTokenMiddleware = require('../middlewares/authenticateTokenMiddleware');
const checkPersonExistenceMiddleware = require('../middlewares/checkPersonExistenceMiddleware');
const checkEmailPhoneUniquenessMiddleware = require('../middlewares/checkEmailPhoneUniquenessMiddleware');
const {
  validateAndSanitizeMiddleware,
} = require('../middlewares/validateAndSanitizeMiddleware');
const loginLimiter = require('../middlewares/loginRateLimiter');
const checkAdminPermission = require('../middlewares/checkAdminPermission');
router.post(
  '/register_retailer',
  validateAndSanitizeMiddleware, // Primeiro valida e sanitiza os dados
  checkPersonExistenceMiddleware, // Verifica se a pessoa já existe no sistema
  checkEmailPhoneUniquenessMiddleware, // Verifica se email ou telefone já estão em uso
  registerRetailer, // Finalmente, chama o controlador para registrar o usuário
);

router.post('/login', loginLimiter, loginUser);
router.post('/logout', authenticateTokenMiddleware, logoutUser);
router.post(
  '/register_admin',
  checkPersonExistenceMiddleware,
  checkEmailPhoneUniquenessMiddleware,
  authenticateTokenMiddleware,
  checkAdminPermission,
  registerAdmin,
);

/*
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateAndSanitize, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

*/

module.exports = router;
