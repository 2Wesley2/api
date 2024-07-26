const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateHttpError = require('../utils/generateHttpError');
const validateParams = require('../utils/validateParams');

const validateLoginCredentials = async (email, phone, password) => {
  validateParams({ password });

  if (!email && !phone) {
    throw generateHttpError(400, 'Por favor, forneça um email ou um telefone.');
  }

  try {
    const query = email ? { email } : { phone };

    const findUser = await User.findOne(query).populate({
      path: 'profile',
      populate: {
        path: 'stores',
      },
    });

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
      profile: findUser.profile
        ? {
            id: findUser.profile._id.toString(),
            stores: findUser.profile.stores.map((store) => ({
              id: store._id.toString(),
              storeName: store.storeName,
              storeAddress: store.storeAddress,
              storeContact: store.storeContact,
            })),
          }
        : null,
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
