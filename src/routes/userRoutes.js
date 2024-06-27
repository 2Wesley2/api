const express = require('express');
const router = express.Router();
const {
  registerUser,
  /*loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  */
} = require('../controllers/userController');
/*const authMiddleware = require('../middlewares/authMiddleware');*/
const checkPersonExistence = require('../middlewares/checkPersonExistence');
const checkEmailPhoneUniqueness = require('../middlewares/checkEmailPhoneUniqueness');
const checkRoleAndPermission = require('../middlewares/checkRoleAndPermission');
const checkAuthForRole = require('../middlewares/checkAuthForRole');
const { validateAndSanitize } = require('../middlewares/validationMiddleware');

router.post(
  '/register',
  validateAndSanitize, // Primeiro valida e sanitiza os dados
  checkPersonExistence, // Verifica se a pessoa já existe no sistema
  checkEmailPhoneUniqueness, // Verifica se email ou telefone já estão em uso
  checkAuthForRole, // Verifica se a autenticação é necessária para o role fornecido
  checkRoleAndPermission, // Verifica a função e permissão do usuário
  registerUser, // Finalmente, chama o controlador para registrar o usuário
);
/*
router.post('/login', validateAndSanitize, loginUser);
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, validateAndSanitize, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
*/
module.exports = router;
