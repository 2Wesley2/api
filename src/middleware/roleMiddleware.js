const roleMiddleware = roles => (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Acesso negado. Usuário não autenticado.' });
  }
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: 'Acesso negado. Função insuficiente.' });
  }
  next();
};

module.exports = roleMiddleware;
