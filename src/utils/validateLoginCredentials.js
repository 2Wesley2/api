const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateHttpError = require('../utils/generateHttpError');

const validateLoginCredentials = async (email, phone, password) => {
  if (!email && !phone) {
    throw generateHttpError(400, 'Por favor, forneça um email ou um telefone.');
  }

  try {
    const query = email ? { email } : { phone };
    const findUser = await User.findOne(query);

    if (!findUser) {
      throw generateHttpError(404, 'Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
      throw generateHttpError(401, 'Credenciais inválidas');
    }

    return {
      id: findUser._id.toString(),
      email: findUser.email || null,
      phone: findUser.phone || null,
      person: findUser.person.toString(),
      role: findUser.role.toString(),
    };
  } catch (error) {
    console.error(
      '[validateLoginCredentials] Erro ao validar credenciais de login:',
      error,
    );
    throw generateHttpError(500, 'Erro interno do servidor', error);
  }
};

module.exports = validateLoginCredentials;
