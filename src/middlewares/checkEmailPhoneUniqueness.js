const User = require('../models/User');

const checkEmailPhoneUniqueness = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: 'Por favor, forneça um email ou um telefone.' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    }).lean();

    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email ou telefone já cadastrados.' });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao verificar unicidade de email e telefone',
      error,
    });
  }
};

module.exports = checkEmailPhoneUniqueness;
