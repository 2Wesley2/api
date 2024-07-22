const Profile = require('../../models/Profile');
const generateHttpError = require('../../utils/generateHttpError');

module.exports.createProfile = async (req, res, next) => {
  const session = req.session;
  const { id } = req;
  try {
    const profile = new Profile({
      user: id,
      stores: [],
    });

    await profile.save({ session });

    res.status(201).json({ message: 'Perfil criado com sucesso', profile });
  } catch (error) {
    next(generateHttpError(500, 'Erro ao criar perfil', error));
  }
};
