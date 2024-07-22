const Profile = require('../../models/Profile');
const generateHttpError = require('../../utils/generateHttpError');
const validateParams = require('../../utils/validateParams');

module.exports.registerProfile = async (userId, stores = []) => {
  try {
    validateParams({ userId });

    const profile = new Profile({
      user: userId,
      stores: stores,
    });

    return profile;
  } catch (error) {
    console.error('Erro ao criar perfil:', error.message);
    throw generateHttpError(500, 'Erro ao criar perfil', error);
  }
};
