const Profile = require('../../models/Profile');
const generateHttpError = require('../../utils/generateHttpError');
const checkUserHasProfileMiddleware = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      return next(generateHttpError(400, 'O usuário já tem um perfil'));
    }
    next();
  } catch (error) {
    next(generateHttpError(500, 'Erro ao verificar perfil do usuário', error));
  }
};
module.exports = checkUserHasProfileMiddleware;
