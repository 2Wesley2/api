const User = require('../../models/User');
const Profile = require('../../models/Profile');
const bcrypt = require('bcryptjs');
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');

const validateLoginCredentials = async (email, phone, password) => {
  validateParams({ password });

  if (!email && !phone) {
    throw generateHttpError(400, 'Por favor, forneça um email ou um telefone.');
  }

  try {
    const query = email ? { email } : { phone };

    const findUser = await User.findOne(query).lean().exec();

    if (!findUser) {
      throw generateHttpError(404, 'Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
      throw generateHttpError(401, 'Credenciais inválidas');
    }
    const userProfile = await Profile.findOne({ user: findUser._id })
      .populate({
        path: 'stores',
        select: 'storeName storeAddress',
      })
      .lean()
      .exec();

    const payload = {
      id: findUser._id.toString(),
      email: findUser.email || null,
      phone: findUser.phone || null,
      person: findUser.person.toString(),
      role: findUser.role.toString(),
      profile: userProfile
        ? {
            id: userProfile._id.toString(),
            stores: userProfile.stores.map((store) => ({
              id: store._id.toString(),
              storeName: store.storeName,
              storeAddress: store.storeAddress,
            })),
          }
        : null,
    };

    return payload;
  } catch (error) {
    console.error(
      '[validateLoginCredentials] Erro ao validar credenciais de login:',
      error,
    );
    throw generateHttpError(500, 'Erro interno do servidor', error);
  }
};

module.exports = validateLoginCredentials;
