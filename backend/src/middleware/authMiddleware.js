const authService = require('../services/AuthService');

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = await authService.verificarToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
}

module.exports = authMiddleware;
