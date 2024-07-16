const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateLoginCredentials = async (email, phone, password) => {
  const errors = [];
  let user = null;

  if (!email && !phone) {
    errors.push({
      msg: 'Por favor, forneça um email ou um telefone.',
      status: 400,
    });
    return { errors, user };
  }

  try {
    const query = email ? { email } : { phone };
    const findUser = await User.findOne(query);

    if (!findUser) {
      errors.push({ msg: 'Credenciais inválidas', status: 404 });
      return { errors, user };
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      errors.push({ msg: 'Credenciais inválidas', status: 401 });
      return { errors, user };
    }

    user = {
      id: findUser._id,
      email: findUser.email || null,
      phone: findUser.phone || null,
      person: findUser.person,
      role: findUser.role,
    };

    return { errors, user };
  } catch (error) {
    errors.push({ msg: 'Erro interno do servidor', status: 500 });
    console.error('Erro ao validar credenciais de login:', error);
    return { errors, user };
  }
};

module.exports = validateLoginCredentials;
