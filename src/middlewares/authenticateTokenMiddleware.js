const jwt = require('jsonwebtoken');

const authenticateTokenMiddleware = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(401).json({
      message: 'Acesso negado. Você precisa ser um usuário e estar autênticado',
    });
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.', error: error.message });
  }
};

module.exports = authenticateTokenMiddleware;
