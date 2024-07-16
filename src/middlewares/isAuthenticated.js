const jwt = require('jsonwebtoken');
const util = require('util');

const verifyToken = util.promisify(jwt.verify);

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: 'Acesso negado. Usuário não autenticado.',
    });
  }

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    req.role = decoded.role;
    req.id = decoded.id;
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = isAuthenticated;
