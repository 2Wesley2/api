const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.SECURE_COOKIES === 'true',
  sameSite: process.env.COOKIE_SAME_SITE === 'Strict' ? 'Strict' : 'Lax',
};

const TOKEN_EXPIRATION = '1d';

exports.loginUser = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: 'Por favor, forneça um email ou um telefone.' });
    }

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'Credenciais inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const payload = {
      id: user._id,
      email: user.email || null,
      phone: user.phone || null,
      person: user.person,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });
    res.cookie('token', token, COOKIE_OPTIONS);
    return res.status(200).json({ message: 'Logado com sucesso' });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res
      .status(500)
      .json({ message: 'Erro ao fazer login', error: error.message });
  }
};
