const jwt = require('jsonwebtoken');

const authenticateTokenMiddleware = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(401).json({
      message: 'Acesso negado. Usuário não autenticado.',
    });
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = authenticateTokenMiddleware;
