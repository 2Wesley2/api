const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', authMiddleware, roleMiddleware(['admin']), UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/', authMiddleware, roleMiddleware(['admin', 'lojista']), UserController.getUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'lojista']), UserController.getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'lojista']), UserController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), UserController.deleteUser);

module.exports = router;
