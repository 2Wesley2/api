const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const validateAndSanitize = [
  check('email').isEmail.withMessage('invalid email').normalizeEmail(),
  check().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/register', authMiddleware, roleMiddleware(['admin']), validateAndSanitize, registerUser);
router.post('/login', validateAndSanitize, loginUser);
router.get('/', authMiddleware, roleMiddleware(['admin', 'lojista']), getUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'lojista']), getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'lojista']), validateAndSanitize, updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin, lojista']), deleteUser);

module.exports = router;
