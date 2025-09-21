const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acesso requerido' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }
    
    req.user = user;
    next();
  });
};

// Middleware para verificar se o usuário é vendedor
const requireSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso restrito a vendedores' 
    });
  }
  next();
};

// Middleware para verificar se o usuário é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso restrito a administradores' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireSeller,
  requireAdmin
};