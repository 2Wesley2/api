const express = require('express');
const router = express.Router();
const {
  registerRetailer,
} = require('../controllers/userControllers/registerRetailer');
const { loginUser } = require('../controllers/userControllers/login');
/*const authMiddleware = require('../middlewares/authMiddleware');*/
const checkPersonExistenceMiddleware = require('../middlewares/checkPersonExistenceMiddleware');
const checkEmailPhoneUniquenessMiddleware = require('../middlewares/checkEmailPhoneUniquenessMiddleware');
const {
  validateAndSanitizeMiddleware,
} = require('../middlewares/validateAndSanitizeMiddleware');
const loginLimiter = require('../middlewares/loginRateLimiter');

router.post(
  '/register_retailer',
  validateAndSanitizeMiddleware, // Primeiro valida e sanitiza os dados
  checkPersonExistenceMiddleware, // Verifica se a pessoa já existe no sistema
  checkEmailPhoneUniquenessMiddleware, // Verifica se email ou telefone já estão em uso
  registerRetailer, // Finalmente, chama o controlador para registrar o usuário
);

router.post('/login', loginLimiter, loginUser);
/*
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateAndSanitize, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
*/
module.exports = router;
