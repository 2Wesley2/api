const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateLoginCredentials = async (email, phone, password) => {
  const errors = [];
  let user = null;

  console.log('[validateLoginCredentials] Iniciando validação de credenciais');
  console.log('[validateLoginCredentials] Dados recebidos:', {
    email,
    phone,
    password,
  });

  if (!email && !phone) {
    console.log(
      '[validateLoginCredentials] Nenhum email ou telefone fornecido',
    );
    errors.push({
      msg: 'Por favor, forneça um email ou um telefone.',
      status: 400,
    });
    return { errors, user };
  }

  try {
    const query = email ? { email } : { phone };
    console.log(
      '[validateLoginCredentials] Query para encontrar usuário:',
      query,
    );
    const findUser = await User.findOne(query);
    console.log('[validateLoginCredentials] Usuário encontrado:', findUser);

    if (!findUser) {
      console.log('[validateLoginCredentials] Usuário não encontrado');

      errors.push({ msg: 'Credenciais inválidas', status: 404 });
      return { errors, user };
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    console.log(
      '[validateLoginCredentials] Validação de senha:',
      isPasswordValid,
    );
    if (!isPasswordValid) {
      console.log('[validateLoginCredentials] Senha inválida');
      errors.push({ msg: 'Credenciais inválidas', status: 401 });
      return { errors, user };
    }

    user = {
      id: findUser._id.toString(),
      email: findUser.email || null,
      phone: findUser.phone || null,
      person: findUser.person.toString(),
      role: findUser.role.toString(),
    };
    console.log('[validateLoginCredentials] Usuário validado:', user);
    return { errors, user };
  } catch (error) {
    console.error(
      '[validateLoginCredentials] Erro ao validar credenciais de login:',
      error,
    );
    errors.push({ msg: 'Erro interno do servidor', status: 500 });
    return { errors, user };
  }
};

module.exports = validateLoginCredentials;
