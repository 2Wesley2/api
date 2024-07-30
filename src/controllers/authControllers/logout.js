const generateHttpError = require('../../utils/generateHttpError');

exports.logoutUser = (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.SECURE_COOKIES === 'true',
      sameSite: process.env.COOKIE_SAME_SITE === 'Strict' ? 'Strict' : 'Lax',
    });
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro durante o logout:', error);
    next(generateHttpError(500, 'Erro ao realizar logout', error));
  }
};
